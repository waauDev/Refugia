"use client"

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import {  useSuspenseQuery } from "@tanstack/react-query"

export const MeetingsView = () =>{

    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}))

    return (
        <div>
            por hacer: datatable
            {JSON.stringify(data?.items)}
        </div>
    )
}

export const MeetingsViewLoading = ()=>{
    return(
        <LoadingState 
            title="Cargando" 
            description="Esto puede tardar unos segundos..."
            />
    )
}

export const MeetingsViewError = () =>{
 return(
        <ErrorState 
            title="No ha sido posible cargar la reunion"
            description="Por favor intentar mas tarde..."
        />
    )
}

