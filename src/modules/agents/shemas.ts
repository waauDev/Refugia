import {z} from "zod"

export const agentsInserSchema = z.object({
    name:z.string().min(1,{message:"Nombre es requerido"}),
    instructions: z.string().min(1, {message:"Instrucciones son requeridas"})
})