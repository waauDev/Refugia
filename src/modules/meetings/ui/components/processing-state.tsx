import { EmptyState } from "@/components/empy-state"


export const ProcessingState = () =>{
    return(
        <div className="bg-white rounded-lg px-4 flex flex-col gap-y-8 items-center justify-center">
            
            <EmptyState
                image="/processing.svg"
                title="Reunion Cancelada"
                description="La reunion fue completada, el resumen aparecera pronto"
             />
        </div>

    )
}