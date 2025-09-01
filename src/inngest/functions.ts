import { StreamTranscript } from "@/modules/meetings/types";
import { inngest } from "./client";
import JSONL from "jsonl-parse-stringify";
import { db } from "@/db";
import { eq, inArray } from "drizzle-orm";
import { agents, meetings, user } from "@/db/schema";

import { createAgent, TextMessage, openai } from "@inngest/agent-kit";


const summarizer = createAgent(
  {
    name: 'meeting-summarizer',
    system: `
You are an expert summarizer. You write readable, concise, simple content. 
You are given a transcript of a meeting and you need to summarize it.

Use the following markdown structure for every output:

### Overview
Provide a detailed, engaging summary of the session's content. Focus on major features, 
user workflows, and any key takeaways. Write in a narrative style, using full sentences. 
Highlight unique or powerful aspects of the product, platform, or discussion.

### Notes
Break down key content into thematic sections with timestamp ranges. Each section should 
summarize key points, actions, or demos in bullet format.

Example:
#### Section Name
- Main point or demo shown here
- Another key insight or interaction
- Follow-up tool or explanation provided

#### Next Section
- Feature X automatically does Y
- Mention of integration with Z
    `.trim(),
    model: openai({
      model: "gpt-4o",
      apiKey: process.env.OPENAI_API_KEY
    })
  }
);



export const meetingProcessing = inngest.createFunction(
    { id: 'meeting/processing' },
    { event: 'meeting/processing' },
    async ({ event, step }) => {
        // logic here
        // const response = await step.fetch(event.data.transcriptUrl);
        const response = await step.run("fetch-transcript", async () => {
            return fetch(event.data.transcriptUrl).then(res => res.text());
        });

        const transcript = await step.run("parse-transcript", async () => {
            return JSONL.parse<StreamTranscript>(response);
        })

        const transcriptWithSpeaker = await step.run("add-speaker", async () => {
            const speakerIds = [
                ...new Set(transcript.map(t => t.speaker_id))
            ];

            const userSpeakers = await db
                .select()
                .from(user)
                .where(inArray(user.id, speakerIds))
                .then((users) => {
                    users.map(u => ({ ...u }))
                });

            const agentSpeakers = await db
                .select()
                .from(agents)
                .where(inArray(agents.id, speakerIds))
                .then((agents) => {
                    agents.map(a => ({ ...a }))
                });

            const speakers = [...userSpeakers, ...agentSpeakers];

            return transcript.map(t => {
                const speaker = speakers.find(s => s.id === t.speaker_id);

                if (!speaker) {
                    return {
                        ...t,
                        user: {
                            name: "Unknown User"
                        }
                    }
                }

                return {
                    ...t, user: {
                        name: speaker.name
                    }
                };
            });

        });


        const { output } = await summarizer.run(
            "Summarize the meeting transcript : " + 
            JSON.stringify(transcriptWithSpeaker)
        );

        await step.run("save-summary", async () => {
            await db.update(meetings).set({
                summary: (output[0] as TextMessage).content as string,
                status: 'completed',
            }).where(eq(meetings.id, event.data.meetingId));
        })

    }
)