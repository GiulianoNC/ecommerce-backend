import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-rol';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
    UsersService: any;

    constructor(private CategoriesService : CategoriesService){}

    //BUSCAR TODAS LAS CATEGORIAS
    @HasRoles(JwtRole.ADMIN)// solo lo pueda ver admin    
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Get()
    finAll(){
      return this.CategoriesService.findAll();
    }


    //CREAR CATEGORIA CON IMAGEN
    @HasRoles(JwtRole.ADMIN)// solo lo pueda ver admin    
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Post('')//categories
    @UseInterceptors(FileInterceptor('file'))
    createWithImage(
        @UploadedFile(
        new ParseFilePipe({
            //para que no envien imagenes muy grandes y de cualqueir tipo
            validators: [
              new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
              new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
            ],
          }),

    ) file: Express.Multer.File,//parametros
    @Body() category: CreateCategoryDto//parametros
    ) {
    //console.log(file);
    console.log('File:', file);
    console.log('Category:', category);
    return this.CategoriesService.create(file, category);
    }

    //ACTUALIZAR
    @HasRoles(JwtRole.ADMIN)// solo lo pueda ver admin    
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Put(':id')//categories
    update(@Param('id', ParseIntPipe) id:number,@Body() category: UpdateCategoryDto)//parametros
    {
      return this.CategoriesService.update(id,category);
    }

    
    //ACTUALIZAR CON IMAGEN
    @HasRoles(JwtRole.ADMIN)// solo lo pueda ver admin    
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Put('upload/:id')//categories
    @UseInterceptors(FileInterceptor('file'))
    updateWithImage(
        @UploadedFile(
        new ParseFilePipe({
            //para que no envien imagenes muy grandes y de cualqueir tipo
            validators: [
              new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
              new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
            ],
          }),

    ) file: Express.Multer.File,//parametros
    @Param('id', ParseIntPipe) id:number,
    @Body() category: UpdateCategoryDto//parametros
    ) {
    //console.log(file);
    console.log('File:', file);
    console.log('Category:', category);
    return this.CategoriesService.updateWithImage(file,id,category);
    }
    
    //ELIMINAR CATEGORIA
    @HasRoles(JwtRole.ADMIN)// solo lo pueda ver admin    
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Delete(':id')//categories
    delete(@Param('id', ParseIntPipe) id:number)//parametros
    {
      return this.CategoriesService.delete(id);
    }
}



