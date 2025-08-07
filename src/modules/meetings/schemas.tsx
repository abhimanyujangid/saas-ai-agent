import { z } from 'zod';


export const meetingInsertSchema = z.object({
  name: z.string().min(1, "Name is required"),
  agentId: z.string().min(1, "Agent ID is required"),
});

export const meetingUpdateSchema = meetingInsertSchema.extend({
  id: z.string().min(1, {
    message: "Meeting ID is required",
  }),
});

