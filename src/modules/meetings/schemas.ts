import {z} from "zod"

export const meetingsInserSchema = z.object({
    name:z.string().min(1,{message:"Nombre es requerido"}),
    agentId: z.string().min(1, {message:"Agente es requerido"})
})


export const meetingUpdateSchema = meetingsInserSchema.extend({
    id:z.string().min(1,{message:"Id es requerido"})
})