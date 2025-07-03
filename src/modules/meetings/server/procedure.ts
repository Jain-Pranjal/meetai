import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { agents, meetings } from "@/db/schema";

import { z } from "zod";
import { eq, getTableColumns, and, ilike, desc, count, sql } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  MIN_PAGE_SIZE,
  MAX_PAGE_SIZE,
  DEFAULT_PAGE_SIZE,
} from "@/constants";
import { TRPCError } from "@trpc/server";
import { meetingInsertSchema, meetingUpdateSchema } from "../schema";
import { MeetingStatus } from "../types";
import { streamVideo } from "@/lib/stream-video";
import { generatedAvatarURI } from "@/lib/avatar";

// this is specifically the procedure for the meetings module

export const meetingsRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        agentId: z.string().nullish(),
        status: z.enum(
            [MeetingStatus.Active,
            MeetingStatus.Completed,
            MeetingStatus.Cancelled,
            MeetingStatus.Processing,
            MeetingStatus.Upcoming]).nullish(),
      })
    )

    .query(async ({ ctx, input }) => {
      const { page, pageSize, search, agentId, status } = input;

      const data = await db
        .select({
         ...getTableColumns(meetings),
          agent: agents,  //individual agent details relevant to the meeting
          duration:sql<number>`EXTRACT(EPOCH FROM (${meetings.endedAt} - ${meetings.startedAt}))`.as("duration"),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id)) // joining the agents table to get the agent details
        .where(
          and(
            eq(meetings.userId, ctx.auth.session.userId), // filtering by userId to ensure only meetings created by the user are returned
            search ? ilike(meetings.name, `%${search}%`) : undefined,
            status ? eq(meetings.status, status) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined
          )
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.userId, ctx.auth.session.userId),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
            status ? eq(meetings.status, status) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined
          )
        );

      const totalPages = Math.ceil(total.count / pageSize);

      // aliasing the count and total count

      return {
        items: data,
        totalCount: total.count,
        totalPages,
      };
    }),



  // fetch a single meeting by id
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingMeeting] = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
            duration:sql<number>`EXTRACT(EPOCH FROM (${meetings.endedAt} - ${meetings.startedAt}))`.as("duration"),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userId, ctx.auth.session.userId)
          )
        );

      if (!existingMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return existingMeeting;
    }),



  create: protectedProcedure
    .input(meetingInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const { auth } = ctx;
      const [createdMeeting] = await db
        .insert(meetings)
        .values({
          ...input,
          userId: auth.user.id, //setting the userId from the auth context into the db
        })
        .returning();


        // Create the stream call and upsert stream users
        // so it will create a new call everytime a meeting is created 
        const call = streamVideo.video.call("default", createdMeeting.id)
        await call.create({
            data: {
                created_by_id: ctx.auth.user.id,
                custom:{
                    meetingId: createdMeeting.id,
                    meetingName: createdMeeting.name,
                },
                settings_override:{
                    transcription: {
                        language: "en",
                        mode:"auto-on",
                        closed_caption_mode: "auto-on",
                    },
                    recording: {
                        mode: "auto-on",
                        quality:"1080p"
                    }
                }
            }
        })

        // fetching the existing agent that this newly created meeting is associated with
        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(
                eq(agents.id, createdMeeting.agentId)
        );

        if (!existingAgent) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Agent not found",
            });
        }

        // the same way that we upsert the user in the stream call, we will upsert the agent as a user in the stream call so that agent can join the call
        await streamVideo.upsertUsers([{
            id: existingAgent.id,
            name: existingAgent.name,
            role: "user",
            image: generatedAvatarURI({
                seed: existingAgent.name,
                variant: "botttsNeutral",
            }),
        }]);




      return createdMeeting;
    }),



  update: protectedProcedure
    .input(meetingUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const [updatedMeeting] = await db
        .update(meetings)
        .set(input)
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userId, ctx.auth.session.userId)
          )
        )
        .returning();

      if (!updatedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return updatedMeeting;
    }),




    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
        const [removedMeeting] = await db
            .delete(meetings)
            .where(
            and(
                eq(meetings.id, input.id),
                eq(meetings.userId, ctx.auth.session.userId)
            )
            )
            .returning();

        if (!removedMeeting) {
            throw new TRPCError({
            code: "NOT_FOUND",
            message: "Meeting not found",
            });
        }

        return removedMeeting;
        }),



    // Tokens need to be generated server-side thats why we are using a server side client i.e. streamVideo
    generateToken:protectedProcedure.mutation(async ({ ctx }) => {
        await streamVideo.upsertUsers([{
            id: ctx.auth.user.id,
            name: ctx.auth.user.name,
            role:"admin",
            image: ctx.auth.user.image ?? generatedAvatarURI({
                seed: ctx.auth.user.name,
                variant: "initials",
            }),
        }])

        const expirationTime=Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour from now
        const issuedAt=Math.floor(Date.now() / 1000)-60;
        const token = streamVideo.generateUserToken({
            user_id: ctx.auth.user.id,
            exp: expirationTime,
            validity_in_seconds: issuedAt

        });

        return token;

    }),

    // The generated user tokens would then be provided to your client-side SDKs for users to authenticate and join the calls


});

// first we need to upsert the user in the stream backend and then we need to generate the token for the user to join the call
