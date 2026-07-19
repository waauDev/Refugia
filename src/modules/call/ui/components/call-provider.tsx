"use client"

import { authClient } from "@/lib/auth-client"
import { generateAvartarUri } from "@/lib/avatar"
import { LoaderIcon } from "lucide-react"
import { CallConnect } from "./call-connect";

interface Props{
    meetingId:string;
    meetingName:string;
}

export const CallProvider =({meetingId, meetingName}:Props)=>{
    const {data, isPending} = authClient.useSession();

    if(!data || isPending){
        return(
            <div className="flex min-h-svh items-center justify-center bg-radial from-sidebar-accent to-sidebar">
                <LoaderIcon className="size-6 animate-spin text-white" />
            </div>
        )
    }

    return(
        <div className="min-h-svh">

            <CallConnect
                meetingId={meetingId}
                meetingName={meetingName}
                userId={data.user.id}
                userName={data.user.name}
                userImage={
                    data.user.image ??
                        generateAvartarUri({seed:data.user.name, variant:"initials"})
                }

            />
        </div>
    )
};
