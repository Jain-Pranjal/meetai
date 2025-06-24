// here we will define the schema for the meetings module to accept the input for the API

import { z } from 'zod';

export const meetingInsertSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    agentId: z.string().min(1, 'Agent is required'),
});



// bascially we need only name and agentId for the meeting to be created so we are defining the schema for that


export const meetingUpdateSchema = meetingInsertSchema.extend({
    id: z.string().min(1, 'Meeting ID is required'),
});