import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { agentsInserSchema } from "../../shemas";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
 } from "@/components/ui/form";
import { toast } from "sonner";





interface AgentFormProps {
    onSuccess?: () =>void;
    onCancel?: () => void;
    initialValues?: AgentGetOne
}

export const AgentForm = ({
    onSuccess,
    onCancel,
    initialValues
}:AgentFormProps)=>{
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: async () =>{
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions(),
                )

                if(initialValues?.id){
                    await queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({id:initialValues.id})
                    )
                }
                onSuccess?.();
            },
            
            onError : (error)=>{
                toast.error(error.message)
            }
        })
    )

    const form = useForm<z.infer<typeof agentsInserSchema>>({
        resolver: zodResolver(agentsInserSchema),
        defaultValues:{
            name:initialValues?.name ?? "",
            instructions:initialValues?.instructions ?? "",
        }
    })
   
    const isEdit = !!initialValues?.id;
    const isPending = createAgent.isPending;

    const onSubmit = (values: z.infer<typeof agentsInserSchema>) =>{
        if(isEdit){
            console.log("Falta realizar el update")
        }else{
            createAgent.mutate(values);
        }
    }

    return(
        <Form {...form}>
            <form className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}>
                <GeneratedAvatar 
                    seed={form.watch("name")}
                    variant="botttsNeutral"
                    className="border size-16"
                />
                <FormField
                    name="name"
                    control={form.control}
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Mr Jhonson"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="instructions"
                    control={form.control}
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Instrucciones</FormLabel>
                            <FormControl>
                                <Textarea
                                {...field} placeholder="Eres un experto en cocina...">
                                    
                                </Textarea>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-between gap-x-2">
                    {onCancel && (
                        <Button
                            variant="ghost"
                            disabled={isPending}
                            type="button"
                            onClick={()=> onCancel()}
                            >
                            Cancelar 
                        </Button>
                    )}
                    <Button disabled={isPending} type="submit">
                        {isEdit ? "Actualizar": "Crear"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}