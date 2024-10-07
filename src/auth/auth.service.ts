import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { In, Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare}from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/roles/rol.entity';

//@Injectable()76
export class AuthService {


    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Rol) private rolesRepository :Repository<Rol>,
        private jwtService: JwtService

    ){}
    
    //METODO PARA REGISTRARSE
    async register(user: RegisterAuthDto){

        const {email, phone}=user;

        //para evitar el error de que el mail esta repetido
        const emailExist= await this.usersRepository.findOneBy({email: email})
        
        if(emailExist){
            //409 CONFLICT
            throw new HttpException('El email ya esta registrado', HttpStatus.CONFLICT)
        }

        const phoneExist= await this.usersRepository.findOneBy({phone: phone})
        
        //para evitar el error de que el telefono esta repetido
        if(phoneExist){
            //409 CONFLICT
            throw new HttpException('El telefono ya existe', HttpStatus.CONFLICT)
        }

        const newUser =this.usersRepository.create(user);
        
        //agregar rol 
        let rolesIds = [];

        if(user.rolesId !== undefined && user.rolesId !== null){
            rolesIds = user.rolesId;
        }else{
            rolesIds.push('CLIENT')
        }
        const roles= await this.rolesRepository.findBy({id: In (rolesIds)});
        newUser.roles =roles;

        //aca estamos guardando toda la informacion del usuario
        const userSaved = await this.usersRepository.save(newUser);//usuario que s eguarda en la base de datos
        const rolesString = userSaved.roles.map(rol => rol.id);
        
        const payload = {
            id: userSaved.id,
            name: userSaved.name,
            roles: rolesString
        };// obtiene la info del usuario a traves de id
        const token = this.jwtService.sign(payload);// 
        const data ={
            user:userSaved,
            token :'Bearer '+ token
        }

        delete data.user.password //antes de pasar todos los datos eliminamos el password
        
        return  data 

    }

    //METODO PARA LOGUEARSE
    async login(loginData: LoginAuthDto){

        //SACAR INFO QUE NECESITO
        const {email, password}=loginData
        //LA INFO QUE NECESITO ESTA EN EL LOGINDATA
        const userfound = await this.usersRepository.findOne ({
            where:{email:email},//indiciar parametro
            relations:['roles'] //cual es la relacion que queremos obtener con la tabla roles
        })
        
        if(!userfound){
            throw new HttpException('El email no existe', HttpStatus.NOT_FOUND);
        }

        
        const isPasswordValid = await compare(password, userfound.password);
        if(!isPasswordValid){
            //ACCESO DENEGADO O PASSWORD INCORRECTO U OLVIDADO
            throw new HttpException('La contraseña es incorrecta', HttpStatus.FORBIDDEN);
        }
        
        const rolesIds = userfound.roles.map(rol => rol.id);//['CLIENT','ADMIN']


        const payload = {
            id: userfound.id,
            name: userfound.name,
            roles: rolesIds};// obtiene la info del usuario a traves de id,nombre y rol
        
        const token = this.jwtService.sign(payload);//OBTENEMOS EL TOKEN DE SESION 
        const data ={
            user:userfound,
            token :'Bearer '+ token
        }

        delete data.user.password //antes de pasar todos los datos eliminamos el password
        
        return  data 
    
    }
}
