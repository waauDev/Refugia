"use client"
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { useState } from "react";
import { UpcomingState } from "../components/upcoming-state";
import { ActiveState } from "../components/active-state";
import { CancelledState } from "../components/cancelled-state";
import { ProcessingState } from "../components/processing-state";

interface Props{
    meetingId:string;
}


export const MeetingIdView = ({meetingId}:Props) =>{

    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();
    const {data} = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({id:meetingId})
    );

    const removeMeeting = useMutation(
        trpc.meetings.Remove.mutationOptions({
            onSuccess:()=>{
                queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));

                router.push("/meetings");
            },
        })
    )

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Esta seguro",
        "La siguiente acción eliminara la reunion"
    )

    const handleRemoveMeeting = async ()=>{
        const ok = await confirmRemove();

        if(!ok) return;

        await removeMeeting.mutateAsync({id:meetingId})
    }

    const isActive = data.status ==="active";
    const isUpComing = data.status ==="upcoming";
    const isCancelled = data.status ==="cancelled";
    const isCompleted = data.status ==="completed";
    const isProcessing = data.status ==="processing";

    const [updateMeetingDialog, setUpdateMeetingDialog] = useState(false);

    return(
        <>
            <RemoveConfirmation />
            <UpdateMeetingDialog 
                open={updateMeetingDialog}
                onOpenChange={setUpdateMeetingDialog}
                initialValues={data}
            />
            <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <MeetingIdViewHeader 
                    meetingId={meetingId}
                    meetingName={data.name}
                    onEdit={()=>setUpdateMeetingDialog(true)}
                    onRemove={handleRemoveMeeting}

                />

            {isCancelled && <CancelledState/>}
            {isProcessing && <ProcessingState/>}
            {isCompleted && <div>Realizada</div>}
            {isActive && <ActiveState meetingId={meetingId}/>}
            {isUpComing && <UpcomingState
                meetingId={meetingId}
                onCancelMeeting={()=>{}}
                isCancelling={false}
            />}
            </div>
           
            
        </>
    )
}

export const MeetingIdViewLoading = ()=>{
    return(
        <LoadingState 
            title="Cargando" 
            description="Esto puede tardar unos segundos..."
            />
    )
}

export const MeetingsIdViewError = () =>{
 return(
        
        <ErrorState 
            title="No ha sido posible cargar la reunion"
            description="Por favor intentar mas tarde..."
        />
    )
}