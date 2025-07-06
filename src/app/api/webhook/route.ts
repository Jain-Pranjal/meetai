import {
    CallEndedEvent,
    CallTranscriptionReadyEvent,
    CallRecordingReadyEvent,
    CallSessionParticipantLeftEvent,
    CallSessionStartedEvent,
    MessageNewEvent
} from "@stream-io/node-sdk"
import { db } from "@/db"
import { agents,meetings } from "@/db/schema"
import { streamVideo } from "@/lib/stream-video"
import {and,eq,not} from "drizzle-orm"
import { NextResponse , NextRequest} from "next/server"
import { inngest } from "@/inngest/client"
import {ChatCompletionMessageParam} from "openai/resources/index.mjs"
import OpenAI from "openai"
import { streamChat } from "@/lib/stream-chat"
import { generatedAvatarURI } from "@/lib/avatar"



const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!
});

// we need to verify the signature of the webhook request to ensure that it is coming from Stream Video and not from any other source
function verifySignatureWithSDK(body: string, signature: string) :boolean{
    return streamVideo.verifyWebhook(body, signature);
}


// we will send the POST req to the webhook URL that will eventually send the data to the stream backend where the actual event functions are there as this route is being registered in the stream video dashboard as a webhook url :-/api/webhook.
// passing all the data to the webhook URL so that it can be processed by the stream backend and the event functions can be triggered accordingly.

export async function POST(req: NextRequest) {
    const signature = req.headers.get("x-signature") ;
    const apiKey= req.headers.get("x-api-key");

    if(!signature || !apiKey) {
        return NextResponse.json({error: "Missing signature or API key"}, {status: 400});
    }

    const body = await req.text(); //converting the request body to string
    if(!verifySignatureWithSDK(body, signature)) {
        return NextResponse.json({error: "Invalid signature"}, {status: 401});
    }


    let payload:unknown;
    try {
        // parsing the body(req data) to JSON
        payload = JSON.parse(body) as Record<string, unknown>;
    } catch (error) {
        return NextResponse.json({error: "Invalid JSON"}, {status: 400});
    }

    const eventType = (payload as Record<string, unknown>)?.type;   //fetching the event type from the payload

    if(eventType==="call.session_started") {
        const event = payload as CallSessionStartedEvent;
        const meetingId = event.call.custom?.meetingId;

        if(!meetingId) {
            return NextResponse.json({error: "Missing meetingId in event"}, {status: 400});
        }

        const [existingMeeting] = await db.select().from(meetings).where(and(
            eq(meetings.id, meetingId),
            not(eq(meetings.status, "completed")),
            not(eq(meetings.status, "active")),
            not(eq(meetings.status, "processing")),
            not(eq(meetings.status, "cancelled"))
        )) //we wannt status to be only upcoming

        if(!existingMeeting) {
            return NextResponse.json({error: "Meeting not found"}, {status: 404});
        }

        await db
        .update(meetings)
        .set({
            status: "active",
            startedAt: new Date(),
        })
        .where(eq(meetings.id, meetingId));


        const [existingAgent] = await db.select().from(agents).where(eq(agents.id, existingMeeting.agentId));

        if(!existingAgent) {
            return NextResponse.json({error: "Agent not found"}, {status: 404});
        }

        // creating a call for the agent to join the call
        const call = streamVideo.video.call("default",meetingId);


        // adding agent 
        const realTimeClient=await streamVideo.video.connectOpenAi({
        call,
        openAiApiKey:process.env.OPENAI_API_KEY!,
        agentUserId: existingAgent.id,
        });

        realTimeClient.updateSession({
            instructions: existingAgent.instructions,
        })

    } else if (eventType === "call.session_participant_left") {
        const event = payload as CallSessionParticipantLeftEvent;
        const meetingId = event.call_cid.split(":")[1];

        if(!meetingId) {
            return NextResponse.json({error: "Missing meetingId"}, {status: 400});
        }

        const call=streamVideo.video.call("default",meetingId);
        await call.end();

    } else if(eventType === "call.session_ended") {
        const event=payload as CallEndedEvent;
        const meetingId = event.call.custom?.meetingId;

        if(!meetingId) {
            return NextResponse.json({error: "Missing meetingId"}, {status: 400});
        }         

        await db
        .update(meetings)
        .set({
            status: "processing",
            endedAt: new Date(),
        })
        .where(eq(meetings.id, meetingId)),
        eq(meetings.status, "active");
        
    }else if (eventType === "call.transcription_ready") {
        const event =payload as CallTranscriptionReadyEvent;
        const meetingId = event.call_cid.split(":")[1];

        const [updatedMeeting] = await db
        .update(meetings)
        .set({
            transcriptUrl: event.call_transcription.url,})
        .where(
            eq(meetings.id, meetingId),
        ).returning();

        if(!updatedMeeting) {
            return NextResponse.json({error: "Meeting not found"}, {status: 404});
        }

        await inngest.send({
            name: "meetings/processing",
            data: {
                meetingId: updatedMeeting.id,
                transcriptUrl: updatedMeeting.transcriptUrl,
            }
        })


    }else if( eventType === "call.recording_ready") {
        const event =payload as CallRecordingReadyEvent;
        const meetingId = event.call_cid.split(":")[1];

        await db
        .update(meetings)
        .set({
            recordingUrl: event.call_recording.url,
        })
        .where(
            eq(meetings.id, meetingId),
        )


    }else if(eventType === "message.new") {
        const event = payload as MessageNewEvent;
        const userId=event.user?.id
        const channelId=event.channel_id;
        const text=event.message?.text

        if(!userId || !channelId || !text) {
            return NextResponse.json({error: "Missing required fields"}, {status: 400});
        }


        const [existingMeeting] = await db.select().from(meetings)
        .where(and(eq(meetings.id, channelId), eq(meetings.status, "completed")));

        if(!existingMeeting) {
            return NextResponse.json({error: "Meeting not found"}, {status: 404});
        }

        const [existingAgent] = await db.select().from(agents).where(eq(agents.id, existingMeeting.agentId));

        if(!existingAgent) {
            return NextResponse.json({error: "Agent not found"}, {status: 404});
        }

        if(userId!==existingAgent.id) {
        const instructions=`
        You are an AI assistant helping the user revisit a recently completed meeting.
        Below is a summary of the meeting, generated from the transcript:
        
        ${existingMeeting.summary}
        
        The following are your original instructions from the live meeting assistant. Please continue to follow these behavioral guidelines as you assist the user:
        
        ${existingAgent.instructions}
        
        The user may ask questions about the meeting, request clarifications, or ask for follow-up actions.
        Always base your responses on the meeting summary above.
        
        You also have access to the recent conversation history between you and the user. Use the context of previous messages to provide relevant, coherent, and helpful responses. If the user's question refers to something discussed earlier, make sure to take that into account and maintain continuity in the conversation.
        
        If the summary does not contain enough information to answer a question, politely let the user know.
        
        Be concise, helpful, and focus on providing accurate information from the meeting and the ongoing conversation.
        `;


      const channel=streamChat.channel("messaging",channelId);
      await channel.watch();

      const previousMessages = channel.state.messages
      .slice(-5)
      .filter((message) => message.text && message.text.trim()!=="")
      .map<ChatCompletionMessageParam>((message) => ({
        role:message.user?.id === existingAgent.id ? "assistant" : "user",
        content: message.text || "",
      }));

      const GPTresponse=await openaiClient.chat.completions.create({
        messages:[
            {role: "system", content: instructions},
            ...previousMessages,
            {role: "user", content: text}, 
        ],
        model:"gpt-4o",
    });

    const GPTresponseText = GPTresponse.choices[0].message.content;

    if(!GPTresponseText){
        return NextResponse.json({error: "No response from AI"}, {status: 500});
    }

    const avatarURL=  generatedAvatarURI({
        seed: existingAgent.name,
        variant: "botttsNeutral",
    })

    streamChat.upsertUsers([{ 
        id: existingAgent.id,
        name: existingAgent.name,
        image: avatarURL,
    }])

    channel.sendMessage({
        text: GPTresponseText,
        user:{
            id: existingAgent.id,
            name: existingAgent.name,
            image: avatarURL,
        }
    })


    
    return NextResponse.json({status:"OK"}, {status: 200});
    
}
}
}
// payload is the data that we get from the req and. convert it to JSON
