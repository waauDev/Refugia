"use client"

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { DataTable } from "@/components/ui/data-table";
import { useTRPC } from "@/trpc/client"
import {  useSuspenseQuery } from "@tanstack/react-query"
import { columns } from "./components/colums";
import { EmptyState } from "@/components/empy-state";
import { useMeetingsFilters } from "../hooks/use-meetings-filters";
import { DataPagination } from "@/components/data-pagination";
import { useRouter } from "next/navigation";

export const MeetingsView = () =>{

    const trpc = useTRPC();
    const router = useRouter();
    const [filters, setFilters] = useMeetingsFilters();
    const {data} = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
        ...filters,
    }))

    

    return (
       <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
        <DataTable data={data.items} columns={columns} onRowClick={(row)=> router.push(`/meetings/${row.id}`)} />
        <DataPagination 
            page={filters.page}
            totalPages={data.totalPages}
            onPageChange={(page)=> setFilters({page})}
        />
        {data.items.length ===0 &&(
        <EmptyState title="Crea tu primer espacio"
                        description="Crea tu primer espacio"/>
                    )}
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

