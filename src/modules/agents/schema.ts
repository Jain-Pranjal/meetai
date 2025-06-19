// here we will define the schema for the agents module to accept the input for the API

import { z } from 'zod';

export const agentInsertSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    instructions: z.string().min(1, 'Instructions are required')});



// bascially we need only name and instructions for the agent to be created so we are defining the schema for that