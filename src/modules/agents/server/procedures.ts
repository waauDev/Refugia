import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter,  protectedProcedure } from "@/trpc/init";
import { trpc } from "@/trpc/server";
import { TRPCError } from "@trpc/server";
import {z} from "zod"
import { eq } from "drizzle-orm";
import { agentsInserSchema } from "../shemas";


export const agentsRouter = createTRPCRouter({
    getOne: protectedProcedure.input(z.object({id:z.string()})).query(async({input})=>{
        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, input.id))

    //await new Promise((resolve)=> setTimeout(resolve, 5000));
    throw new TRPCError({code:"BAD_REQUEST"});

    return existingAgent;
    }),
    getMany: protectedProcedure.query(async()=>{
        const data = await db
            .select()
            .from(agents)

    //await new Promise((resolve)=> setTimeout(resolve, 5000));
    //throw new TRPCError({code:"BAD_REQUEST"});

    return data;
    }),

    create: protectedProcedure
        .input(agentsInserSchema)
        .mutation(async({input, ctx})=>{
            const [createdAgent] = await db
                .insert(agents)
                .values({
                    ...input,
                    userId:ctx.auth.user.id
                })
                .returning();

                 return createdAgent
        })
        

       
})
