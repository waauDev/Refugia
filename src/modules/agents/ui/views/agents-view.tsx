"use client"

import {  useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC} from "@/trpc/client"
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";

export const AgentsView = () =>{
    const trpc = useTRPC();

    const{data} = useSuspenseQuery(trpc.agents.getMany.queryOptions());



    return(
        <div>
            {JSON.stringify(data,null,2)}
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

