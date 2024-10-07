import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';

@Injectable()
export class RolesService {
    //metodos para agregar info a la db mas especificamente en la tabla de roles
    constructor(@InjectRepository(Rol) private rolesRepository: Repository<Rol>){}

    create(rol: CreateRolDto){
        const newRol = this.rolesRepository.create(rol);
        return this.rolesRepository.save(newRol);
    }

}
