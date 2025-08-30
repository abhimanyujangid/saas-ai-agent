import {
    CallEndedEvent,
    CallTranscriptionReadyEvent,
    CallSessionParticipantLeftEvent,
    CallRecordingReadyEvent,
    CallSessionStartedEvent
} from "@stream-io/video-react-sdk";

// Drizzle ORM
import { and , eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { agents, meetings } from "@/db/schema";
import  streamVideo  from "@/lib/stream-video";
import { db } from "@/db";


function verifySignatureWithSDK(body: string, signature: string): boolean {
    return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
    // Validate required environment variables
    if (!process.env.OPENAI_API_KEY) {
        console.error('OPENAI_API_KEY is not set');
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const signature = req.headers.get("x-signature") || "";
    const apiKey = req.headers.get("x-api-key") || "";

    if (!apiKey || !signature) {
        return NextResponse.json({ error: "Missing API key or signature" }, { status: 401 });
    }

    const body = await req.text();

    if (!verifySignatureWithSDK(body, signature)) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    let payload : unknown;

    try {
        payload = JSON.parse(body) as Record<string, unknown>;
    } catch (error) {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const eventType = (payload as Record<string, unknown>)?.type;

    console.log(`Received webhook event: ${eventType}`);

    if (eventType === "call.session_started") {
        try {
            const event  = payload as CallSessionStartedEvent;
            const meetingId = event.call.custom?.meetingid;

            if(!meetingId){
                return NextResponse.json({ error: "Missing meeting ID" }, { status: 400 });
            }

            const [existingMeeting] = await db
                .select()
                .from(meetings)
                .where(
                    and(
                        eq(meetings.id, meetingId),
                        eq(meetings.status, 'upcoming')
                    )
                );

            if (!existingMeeting) {
                return NextResponse.json({ error: "Meeting not found or not in upcoming status" }, { status: 404 });
            }

            await db
            .update(meetings)
            .set({
                status: 'active',
                startedAt: new Date()
            })
            .where(eq(meetings.id, existingMeeting.id));

            const [existingAgent] = await db
                .select()
                .from(agents)
                .where(eq(agents.id, existingMeeting.agentId));

            if (!existingAgent) {
                return NextResponse.json({ error: "Agent not found" }, { status: 404 });
            }

            const call = streamVideo.video.call('default', meetingId);

            const realtimeClient = await streamVideo.video.connectOpenAi({
                call,
                openAiApiKey: process.env.OPENAI_API_KEY!,
                agentUserId: existingAgent.id
            });

            realtimeClient.updateSession({
                instructions: existingAgent.instruction
            });

        } catch (error) {
            console.error('Error handling call.session_started:', error);
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
    } else if(eventType === 'call.session_participant_left') {
        try {
            const event = payload as CallSessionParticipantLeftEvent;
            const meetingId = event.call_cid.split(':')[1];

            if(!meetingId){
                return NextResponse.json({ error: "Missing meeting ID" }, { status: 400 });
            }

            // Update meeting status to completed
            await db
                .update(meetings)
                .set({
                    status: 'completed',
                    endedAt: new Date()
                })
                .where(eq(meetings.id, meetingId));

            const call = streamVideo.video.call('default', meetingId);
            await call.end();

        } catch (error) {
            console.error('Error handling call.session_participant_left:', error);
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
    } else if (eventType === 'call.ended') {
        try {
            const event = payload as CallEndedEvent;
            const meetingId = event.call.id;

            if (!meetingId) {
                return NextResponse.json({ error: "Missing meeting ID" }, { status: 400 });
            }

            await db
                .update(meetings)
                .set({
                    status: 'completed',
                    endedAt: new Date()
                })
                .where(eq(meetings.id, meetingId));

        } catch (error) {
            console.error('Error handling call.ended:', error);
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
    } else if (eventType === 'call.transcription_ready') {
        try {
            const event = payload as CallTranscriptionReadyEvent;
            // Note: You may need to adjust these property accesses based on the actual event structure
            const meetingId = (event as any).call_cid?.split(':')[1];
            const transcriptUrl = (event as any).url;

            if (!meetingId || !transcriptUrl) {
                return NextResponse.json({ error: "Missing meeting ID or transcript URL" }, { status: 400 });
            }

            await db
                .update(meetings)
                .set({
                    transcriptUrl: transcriptUrl,
                    status: 'processing'
                })
                .where(eq(meetings.id, meetingId));

        } catch (error) {
            console.error('Error handling call.transcription_ready:', error);
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
    } else if (eventType === 'call.recording_ready') {
        try {
            const event = payload as CallRecordingReadyEvent;
            // Note: You may need to adjust these property accesses based on the actual event structure
            const meetingId = (event as any).call_cid?.split(':')[1];
            const recordingUrl = (event as any).url;

            if (!meetingId || !recordingUrl) {
                return NextResponse.json({ error: "Missing meeting ID or recording URL" }, { status: 400 });
            }

            await db
                .update(meetings)
                .set({
                    recordingUrl: recordingUrl
                })
                .where(eq(meetings.id, meetingId));

        } catch (error) {
            console.error('Error handling call.recording_ready:', error);
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
    }
    return NextResponse.json({ status: 'ok' });

    // Handle the webhook event
}