import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-users.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guards';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-rol';

//DEFINIR LAS RUTAS DE NUESTRO API REST
@Controller('users')
export class UsersController {

    constructor(private UsersService: UsersService){}

    //GER -> OBTENER DATOS
    //POST -> CREAR
    //PUT * PATCH -> ACTUALIZAR
    //DELETE * -> BORRAR


    @HasRoles(JwtRole.ADMIN)// solo lo pueda ver admin
    //@UseGuards(JwtAuthGuard, JwtRolesGuard)//PARA PROTEGER ESTA RUTA 
    @Get()//http://localhost/users -> GET
    findAll(){
        return this.UsersService.findAll();
    }
    
    @Post()//http://localhost/users -> POST
    create(@Body()user: CreateUserDto){
        return this.UsersService.create(user);

    }
    
    @HasRoles(JwtRole.CLIENT)// solo lo pueda ver admin
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA     
    @Put(':id')//http://192.168.0.21:3000/users/:id -> POST
    update(@Param('id', ParseIntPipe)id: number, @Body() user: UpdateUserDto){
        return this.UsersService.update(id, user);

    }

    @HasRoles(JwtRole.ADMIN,JwtRole.CLIENT)// solo lo pueda ver admin    
    //@UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Put('upload/:id')
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
    @Param('id', ParseIntPipe) id: number,//parametros
    @Body() user: UpdateUserDto//parametros
    ) {
    console.log(file);
    return this.UsersService.updateWithImage(file, id, user);
    }

}
