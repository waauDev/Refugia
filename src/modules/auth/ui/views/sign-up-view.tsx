"use client"

import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {Alert, AlertTitle} from "@/components/ui/alert";
import { OctagonAlertIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {FaGoogle, FaGithub} from "react-icons/fa";

import { Card, CardContent } from "@/components/ui/card"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";



const formSchema = z.object({
    name: z.string().min(1, {message:"Nombre del usuario es requerido"}),
    email: z.string().email(),
    password:z.string().min(1, {message:"Contraseña es requerida"}),
    confirmPassword: z.string().min(1, {message:"Contraseña es requerida"})
}).refine((data)=> data.password === data.confirmPassword,{
    message:"Contraseñas no son iguales",
    path:["confirmPassword"]
});


export const SignUpView = ()=>{

    
    const [error, setError] = useState<null|string>(null);
    const [pending, setPending] = useState(false);
    const router= useRouter();

    const form = useForm<z.infer<typeof formSchema>> ({
        resolver: zodResolver(formSchema),
        defaultValues:{
            name:"",
            email:"",
            password:"",
            confirmPassword:""
        }
    })

    const onSubmit = (data: z.infer<typeof formSchema>)=>{
        setError(null);
        setPending(true);
        
        authClient.signUp.email(
        {
            name:data.name,
            email:data.email,
            password:data.password,
            callbackURL:"/"
        },
        {
            onSuccess: ()=>{
                setPending(false);
                router.push("/");
                
            },
            onError:({error})=>{
                setPending(false);
                setError(error.message);
            }
        },
        
    )}

      const onSocial = (provider:"github" | "google")=>{
        setError(null);
        setPending(true);
        
        authClient.signIn.social(
        {
            provider: provider,
            callbackURL:"/"
        },
        {
            onSuccess: ()=>{
                setPending(false);
            },
            onError:({error})=>{
                setPending(false);
                setError(error.message);
            }
        },
        
    )}

    return(
        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">Crea una cuenta</h1>
                                    <p className="text-muted-foreground text-balance">
                                        Registrate
                                    </p>
                                </div>
                                <div className="grid gap-3">
                                    <FormField 
                                        control={form.control}
                                        name="name"
                                        render={({field})=>(
                                            <FormItem>
                                                <FormLabel>Nombre</FormLabel>
                                                <FormControl>
                                                    <Input type="text"
                                                        placeholder="John Doe"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />  
                                </div>
                                <div className="grid gap-3">
                                    <FormField 
                                        control={form.control}
                                        name="email"
                                        render={({field})=>(
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email"
                                                        placeholder="a@ejemplo.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />  
                                </div>
                                <div className="grid gap-3">
                                    <FormField 
                                        control={form.control}
                                        name="password"
                                        render={({field})=>(
                                            <FormItem>
                                                <FormLabel>Contraseña</FormLabel>
                                                <FormControl>
                                                    <Input type="password"
                                                    placeholder="*******"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                
                                            </FormItem>
                                        )}
                                    />  
                                </div>
                                <div className="grid gap-3">
                                    <FormField 
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({field})=>(
                                            <FormItem>
                                                <FormLabel>Confirmar Contraseña</FormLabel>
                                                <FormControl>
                                                    <Input type="password"
                                                    placeholder="*******"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />  
                                </div>
                                {!!error && (
                                    <Alert className="bg-destructive/10 border-none">
                                        <OctagonAlertIcon className="h-4 w-4 !text-destructive"/>
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                )}

                                <Button
                                    disabled={pending}
                                    type="submit"
                                    className="w-full"
                                >Registrate</Button>
                                
                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2">O continua con</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        disabled={pending}
                                        onClick={()=>onSocial("google")}
                                        variant="outline"
                                        type="button"
                                        className="w-full"
                                    >
                                      <FaGoogle />      
                                    </Button>
                                    <Button
                                        disabled={pending}
                                        onClick={()=>onSocial("github")}
                                        variant="outline"
                                        type="button"
                                        className="w-full"
                                    >
                                        <FaGithub/>
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    ¿Ya estás en Refugia?  
                                    <Link 
                                    className="underline underline-offset-4" href="/sign-in">
                                     Inicia Sesión
                                    </Link>
                                    
                                    
                                </div>    
                            </div>       
                        </form>

                    </Form>

                    <div className="bg-radial from-green-700 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
                        <img src="./logo.svg" alt="Imagen" className="h-[92px] w-[92px]"/>
                        <p className="text-2xl font-semibold text-white">RefugIa</p>
                    </div>
                    
                </CardContent>
            </Card>

            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                               Al hacer clic en «Ingresar» para unirte o iniciar sesión, aceptas las Condiciones de uso, la Política de privacidad y la Política de cookies de Refugia.
            </div>
        </div>
        
    )
}