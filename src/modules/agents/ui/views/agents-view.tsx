"use client"

import {  useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC} from "@/trpc/client"
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "../components/data-table";
import { columns} from "../components/colums";
import { EmptyState } from "@/components/empy-state";



export const AgentsView = () =>{
    const trpc = useTRPC();

    const{data} = useSuspenseQuery(trpc.agents.getMany.queryOptions());



    return(
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable data={data} columns={columns} />
            {data.length ===0 &&(
                <EmptyState title="Crea tu primer agente"
                description="Crea un agente inteligente con quien puedas conversar, desahogarte o generar nuevas ideas.
Tu agente estará disponible para escucharte, ayudarte a hacer brainstorming y mantener conversaciones útiles en cualquier momento."/>
            )}
        </div>
    )

}

export const AgentsViewLoading = ()=>{
    return(
        <LoadingState 
            title="Cargando" 
            description="Esto puede tardar unos segundos..."
            />
    )
}

export const AgentsViewError = () =>{
 return(
        <ErrorState 
            title="No ha sido posible cargar los agentes"
            description="Por favor intentar mas tarde..."
        />
    )
}

