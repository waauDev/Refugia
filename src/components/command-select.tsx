import { cn } from "@/lib/utils";
import { ChevronsUpDownIcon } from "lucide-react";
import {ReactNode, useState } from "react";
import { Button } from "./ui/button";
import {
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
    CommandResponsiveDialog
}from "@/components/ui/command"

interface Props{
    options:Array<{
        id:string;
        value:string;
        children:ReactNode;
    }>;
    onSelect:(value:string)=>void;
    onSearch?:(value:string)=> void;
    value:string;
    placeholder?:string;
    isSearchable?:boolean;
    className?:string;
}


export const CommandSelect  = ({
    options,
    onSearch,
    value,
    placeholder="Seleccione una opción",
    isSearchable,
    className,
    onSelect,
}:Props)=>{
    const [open, setOpen] = useState(false);
    const selectedOption = options.find((option)=> option.value === value);

    return(
        <>
        <Button
            onClick={()=> setOpen(true)}
            type="button"
            variant="outline"
            className={cn(
                "h-9 justify-between font-normal px-2",
                !selectedOption && "text-muted-foreground",
                className
            )}
            >
            <div>
                {selectedOption?.children?? placeholder}
            </div>    
            <ChevronsUpDownIcon/>
        </Button>
        <CommandResponsiveDialog
            open={open}
            onOpenChange={setOpen}
            shouldFilter={!onSearch}
            >
                <CommandInput placeholder="Buscar ..." onValueChange={onSearch}/>
                <CommandList>
                    <CommandEmpty>
                        <span className="text-muted-foreground text-sm">
                            Opciones no encontradas
                        </span>
                    </CommandEmpty>
                    {options.map((option)=>(
                        <CommandItem
                            key={option.id}
                            onSelect={()=>{
                                onSelect(option.value)
                                setOpen(false);
                            }}
                            >
                                {option.children}

                        </CommandItem>
                    ))}
                </CommandList>
        </CommandResponsiveDialog> 
        </>
    )
}



