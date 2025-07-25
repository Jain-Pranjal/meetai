import { inngest } from "@/inngest/client";
import { StreamTranscriptItem } from "@/modules/meetings/types";
import JSONL from "jsonl-parse-stringify";
import { db } from "@/db";
import { agents, user ,meetings} from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { createAgent, openai, TextMessage } from "@inngest/agent-kit";

// we have to send the data:{transcriptUrl . meetingId} to this component

// inngest has the agent kit which allows us to create agents that can process data and perform actions based on the data

// building the agent to summarize the meeting transcript and directly used as a step
const summarizer = createAgent({
  name: "Summarizer",
  system: `
  You are an expert summarizer. You write readable, concise, simple content. You are given a transcript of a meeting and you need to summarize it.

Use the following markdown structure for every output:

### Overview
Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique or powerful aspects of the product, platform, or discussion.

### Notes
Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet format.

Example:
#### Section Name
- Main point or demo shown here
- Another key insight or interaction
- Follow-up tool or explanation provided

#### Next Section
- Feature X automatically does Y
- Mention of integration with Z
  `.trim(),
  model: openai({ model: "gpt-4o", apiKey: process.env.OPENAI_API_KEY }),
});

export const meetingsProcessing = inngest.createFunction(
  { id: "meetings/processing" },
  { event: "meetings/processing" },
  async ({ event, step }) => {
    const response = await step.run("fetch-transcript", async () => {
      return fetch(event.data.transcriptUrl).then((res) => {
        return res.text();  // as jsonl.parse accepts a string
      });
    });
     


// we need to parse the transcript as it is in JSONL format
    const transcript = await step.run("parse-transcript", async () => {
      return JSONL.parse<StreamTranscriptItem>(response);  //return array
      // this type is defined as it is the in the transcript URL
    });

    const transcriptWithSpeakers = await step.run("add-speakers", async () => {
      const speakerIds = [
        ...new Set(transcript.map((item) => item.speaker_id)),
      ];

      const userSpeaker = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakerIds))
        .then((users) => {
          return users.map((u) => ({ ...u }));
        });

      const agentSpeaker = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakerIds))
        .then((agents) => {
          return agents.map((agent) => ({ ...agent }));
        });

      const speakers = [...userSpeaker, ...agentSpeaker];

      return transcript.map((item) => {
        const speaker = speakers.find(
          (speaker) => speaker.id === item.speaker_id
        );

        if (!speaker) {
          return {
            ...item,
            user: {
              name: "Unknown User",
            },
          };
        }
        return {
          ...item,
          user: {
            name: speaker.name,
          },
        };
      });
    });

  // transcriptWithSpeakers will have all the info along with speaker names in it 

    const {output}=await summarizer.run(
      "Summarize the following transcript : "+
      JSON.stringify(transcriptWithSpeakers),  //concating the string
    )

    await step.run("save-summary", async () => {
      await db
        .update(meetings)
        .set({
          summary:(output[0] as TextMessage).content as string,
          status: "completed",
        })
        .where(eq(meetings.id, event.data.meetingId));


  }
)})


// bascially we are adding and making the steps that will run a background job to process the meeting data after the meeting is completed



/*
STEPS
1. Fetch the transcript from the provided URL.
2. Parse the transcript from JSONL format into JSON.
3. Add speaker information to each transcript item.
4. Summarize the meeting transcript.
5. Save the summary and status to the database.
*/

