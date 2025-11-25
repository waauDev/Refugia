"use client";

import { authClient } from "@/lib/auth-client"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";


export default function Home() {

  const {
    data:session
  } = authClient.useSession();

  const [name, setName] = useState("");
  const[email, setEmail]=useState("");
  const[password, setPassword]= useState("");

  const onSubmit = () =>{
    authClient.signUp.email({
      email,
      name,
      password
  
    },
    {
       
        onSuccess: () => {
            window.alert("Success")
        },
        onError: (ctx) => {
            // display the error message
            alert(ctx.error.message);
            window.alert("Algo no funciono:"+ctx.error.message);
        },
      }
  )}
   
  if(session){
    return(
      <div className="flex flex-col p-4 gap-y-4">
        <p>Sesion de {session.user.name}</p>
        <Button onClick={()=> authClient.signOut()}>
          Salir
        </Button>
      </div>
    ) 
  }
  return (
    <div className="p-4 flex flex-col gap-y-4">
        <Input placeholder="Nombre" value={name} onChange={(e)=> setName(e.target.value)}/>
        <Input placeholder="correo" value={email} onChange={(e)=> setEmail(e.target.value)}/>
        <Input placeholder="contraseña"value={password} onChange={(e)=> setPassword(e.target.value)} type="password"/>
        <Button variant="default" onClick={onSubmit}>Registrar</Button>
    </div>
  );
}
