import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import  storage  = require('../utils/cloud_storage');
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './dto/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {//CRUD

    constructor(
        @InjectRepository(Category) private categoriesRepository: Repository<Category>//para traer los metodos
    ){}

    findAll(){
       return this.categoriesRepository.find() 
    }

    async create(file: Express.Multer.File, category: CreateCategoryDto){

        const url = await storage(file, file.originalname);

        if(url === undefined && url === null){
            throw new HttpException('La imagen no se pudo guardar', HttpStatus.INTERNAL_SERVER_ERROR);

        }
        category.image = url;

        const newCategory = this.categoriesRepository.create(category) //para cuando almacene esa informacion, me devueltva tambien ya lko que tenia desde antes

        
        return this.categoriesRepository.save(newCategory);
    }

    async updateWithImage(file: Express.Multer.File,id: number, category: UpdateCategoryDto){//recibir parametros
        
        const url = await storage(file, file.originalname);

        if(url === undefined && url === null){
            throw new HttpException('La imagen no se pudo guardar', HttpStatus.INTERNAL_SERVER_ERROR);

        }

        const categoryFound = await this.categoriesRepository.findOneBy({id: id});
        if(!categoryFound){
            throw new HttpException('La categoria no existe', HttpStatus.NOT_FOUND);

        }        
        category.image = url;
        const updateCategory = Object.assign(categoryFound, category);

        return this.categoriesRepository.save(updateCategory);
    }

    async update(id: number, category: UpdateCategoryDto){//recibir parametros
        

        const categoryFound = await this.categoriesRepository.findOneBy({id: id});
        if(!categoryFound){
            throw new HttpException('La categoria no existe', HttpStatus.NOT_FOUND);

        }        
        
        const updateCategory = Object.assign(categoryFound, category);

        return this.categoriesRepository.save(updateCategory);
    }

    async delete(id: number){
        const categoryFound = await this.categoriesRepository.findOneBy({id: id});
        if(!categoryFound){
            throw new HttpException('La categoria no existe', HttpStatus.NOT_FOUND);

        } 
        return this.categoriesRepository.delete(id);
    }


}
