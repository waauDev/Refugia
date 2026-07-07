import { EmptyState } from "@/components/empy-state"
import { Button } from "@/components/ui/button"
import { VideoIcon } from "lucide-react"
import Link from "next/link"

interface Props{
    meetingId: string;
   
}


export const ActiveState = ({
    meetingId
}:Props) =>{
    return(
        <div className="bg-white rounded-lg px-4 flex flex-col gap-y-8 items-center justify-center">
            
            <EmptyState
                image="/upcoming.svg"
                title="Reunion Activa"
                description="La reunion terminara cuando todos los participantes salgan"
             />
             <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
                <Button  asChild className="w-full lg:w-auto">
                    <Link href={`/call/${meetingId}`}>
                        <VideoIcon />
                        Unirse a la reunion
                    </Link>
                </Button>
             </div>
        </div>

    )
}