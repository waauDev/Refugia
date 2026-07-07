import { EmptyState } from "@/components/empy-state"
import { Button } from "@/components/ui/button"
import { BanIcon, VideoIcon } from "lucide-react"
import Link from "next/link"

interface Props{
    meetingId: string;
    onCancelMeeting: ()=>void;
    isCancelling:boolean;
}


export const UpcomingState = ({
    meetingId,
    onCancelMeeting,
    isCancelling
}:Props) =>{
    return(
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
            
            <EmptyState
                image="/upcoming.svg"
                title="No ha comenzado aun"
                description="Una vez incie la reunion , el resumen aparecera aca"
             />
             <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
                <Button
                    variant="secondary"
                    className="w-full lg:w-auto"
                    onClick={onCancelMeeting}
                    disabled={isCancelling}
                    >
                    <BanIcon />
                    Cancelar Reunion 
                </Button>

                <Button disabled={isCancelling} asChild className="w-full lg:w-auto">
                    <Link href={`/call/${meetingId}`}>
                        <VideoIcon />
                        Empezar Reunión
                    </Link>
                </Button>
             </div>
        </div>

    )
}