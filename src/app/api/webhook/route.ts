import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import { CallEndedEvent,
    CallTranscriptionReadyEvent,
    CallSessionParticipantLeftEvent,
    CallRecordingReadyEvent,
    CallSessionStartEvent,
 } from "@stream-io/node-sdk";
import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { gunzipSync } from "zlib";


function verifySignatureWithSDK(body:string, signature:string):boolean{
    return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req:NextRequest){
    const signature = req.headers.get("x-signature");
    const apiKey= req.headers.get("x-api-key");

    if(!signature || !apiKey){
        return NextResponse.json(
            {error:"Missing signature Key"},
            {status:400}
        )
    }

      // Leer el body como bytes crudos, no como texto
    const rawBuffer = Buffer.from(await req.arrayBuffer());

    const contentEncoding = req.headers.get("content-encoding");

    let body: string;
    if (contentEncoding === "gzip") {
        body = gunzipSync(rawBuffer).toString("utf-8");
    } else {
        body = rawBuffer.toString("utf-8");
    }

    

    if(!verifySignatureWithSDK(body, signature)){

        // console.log("Firma inválida. body:", body);
        // console.log("signature recibida:", signature);
        // console.log("apiKey recibida:", apiKey);
        return NextResponse.json({error:"Invalid Signature"}, {status:401})
    }

    let payload : unknown;

    try{
        payload = JSON.parse(body) as Record<string, unknown>;
        // console.log("Revisando:",payload);
    }catch{
        return NextResponse.json({error:"Invalid JSON"},{status:400});
    }

    const eventType = (payload as Record<string, unknown>)?.type;

    if(eventType==="call.session_started"){
        const event = payload  as CallSessionStartEvent;
        const meetingId = event.call.custom?.meetingId;

        if(!meetingId){
            return NextResponse.json({error:"Missing Meeting id"}, {status:400});
        }
        
        const [existingMeeting] = await db
            .select()
            .from(meetings)
            .where(
                and(
                    eq(meetings.id, meetingId),
                    not(eq(meetings.status, "completed")),
                    not(eq(meetings.status, "active")),
                    not(eq(meetings.status,"cancelled")),
                    not(eq(meetings.status,"processing")),
                )
            );
            
        if(!existingMeeting){
            return NextResponse.json({error:"Meeting not found"}, {status:400})
        }

        

        await db
            .update(meetings)
            .set({
                status:"active",
                startedAt:new Date(),
            })
            .where(eq(meetings.id, existingMeeting.id));
        
        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingMeeting.agentId));
        
        if(!existingAgent){
            return NextResponse.json({error:"Agent not found"},{status:400});
        }

        const call = streamVideo.video.call("default", meetingId);
        try{
        const realTimeClient = await streamVideo.video.connectOpenAi({
            call, 
            openAiApiKey: process.env.OPENAI_API_KEY!,
            model: "gpt-realtime",
            agentUserId:existingAgent.id
        });

        realTimeClient.updateSession({
            instructions:existingAgent.instructions
        });
        }catch(error:any){
            console.error("connectOpenAi failed - message:", error.message);
            console.error("connectOpenAi failed - type:", error.type);
            console.error("connectOpenAi failed - error completo:", JSON.stringify(error.error, null, 2));
            return NextResponse.json({ error: "Failed to connect agent" }, { status: 500 });
        }
    }else if(eventType==="call.session_participant_left"){
        const event= payload as CallSessionParticipantLeftEvent;
        const meetingId = event.call_cid.split(":")[1];

        if(!meetingId){
            return NextResponse.json({error:"Missing Meeting id"},{status:400});
        }

        const call = streamVideo.video.call("default", meetingId);
        await call.end();
    }

    return NextResponse.json({status:"ok"});
}
