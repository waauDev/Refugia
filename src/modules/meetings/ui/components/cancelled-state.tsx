import { EmptyState } from "@/components/empy-state"


export const CancelledState = () =>{
    return(
        <div className="bg-white rounded-lg px-4 flex flex-col gap-y-8 items-center justify-center">
            
            <EmptyState
                image="/cancelled.svg"
                title="Reunion Cancelada"
                description="La reunion fue cancelada"
             />
        </div>

    )
}