"use client"

import { ErrorState } from "@/components/error-state"

const ErrorPage = () =>{
    return(
        <ErrorState 
            title="No ha sido posible cargar los agentes"
            description="Por favor intentar mas tarde..."
        />
    )
}

export default ErrorPage;