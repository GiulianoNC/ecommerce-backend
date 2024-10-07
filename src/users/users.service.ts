import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import{ InjectRepository} from '@nestjs/typeorm';
import{ User} from './user.entity';
import{ Repository} from 'typeorm';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import  storage  =require ('../utils/cloud_storage');


//HACER CONSULTAS USANDO INYECCION DE DEPENDENCIAS
@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private usersRepository :Repository<User>,

    ){}
    
    //metodo para almacenar usuario
    create(user: CreateUserDto){
        const newUser =this.usersRepository.create(user);
        return this.usersRepository.save(newUser)
    }

    //metodo para obtener todos los usuarios
    findAll(){
        return this.usersRepository.find({relations: ['roles']})
    }

    //metodo para actualizar usuarios
    async update(id:number, user: UpdateUserDto){
        const userFound = await this.usersRepository.findOneBy({id: id});

        if(!userFound){
            throw new HttpException('usuario no existe',HttpStatus.NOT_FOUND);

        }
        //va a tomar el usuario que encontró
        const updatedUser = Object.assign(userFound, user)
        return this.usersRepository.save(updatedUser)
    }
    

    
    async updateWithImage(file: Express.Multer.File, id: number, user:UpdateUserDto){
        const url = await storage(file, file.originalname);
        console.log('URL_ '+ url);

        if(url !== undefined &&  url !== null){
            const userFound = await this.usersRepository.findOneBy({id: id});

            if(!userFound){
                throw new HttpException('La imagen no se pudo guardar',HttpStatus.INTERNAL_SERVER_ERROR);
    
            }
            user.image = url;//si tiene la imagen guardada, lo hace en user.image
            //va a tomar el usuario que encontró
            const updatedUser = Object.assign(userFound, user)
            return this.usersRepository.save(updatedUser);
    
        }

    }

    
}
