import {  IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

//que informacion vamos a mandar? o tenemos que validar
export class RegisterAuthDto{

    //@IsNotEmpty()//que no este vacio
    @IsString()//que sea un string
    name?: string;

    //@IsNotEmpty()//que no este vacio
    @IsString()//que sea un string    
    lastname?: string;

    //@IsNotEmpty()//que no este vacio
    @IsString()//que sea un string
    @IsEmail({}, {message: 'El email no es valido'})//que sea un email
    email?: string;
    
    //@IsNotEmpty()//que no este vacio
    @IsString()//que sea un string    
    phone?: string;
    
    @IsNotEmpty()//que no este vacio
    @IsString()//que sea un string
    @MinLength(6, {message: 'la coantraseña debe tener al menos 6 caracteres'})// que al menos tenga 6 caracteres    
    password?: string; 

    
    rolesId:string[];
}