import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRole } from 'src/auth/jwt/jwt-rol';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update.address.dot';

@Controller('address')
export class AddressController {

    constructor(private addressService: AddressService){}

    //Crear
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)// solo lo pueda ver admin    
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Post()//address
    create(@Body() address: CreateAddressDto)
    {
      return this.addressService.create(address);
    }

    //ACTUALIZAR
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)// solo lo pueda ver admin    
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Get()//address
    findAll(){
      return this.addressService.findAll();
    }

    @HasRoles(JwtRole.ADMIN)// solo lo pueda ver admin    
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Get('user/:id_user')//address
    findByUser(@Param('id_user', ParseIntPipe)id_user:number){
      return this.addressService.findByUser(id_user);
    }

    @HasRoles(JwtRole.ADMIN)// solo lo pueda ver admin    
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Put(':id')//address
    update(@Param('id', ParseIntPipe) id: number, @Body() address: UpdateAddressDto ){
      return this.addressService.update(id,address );
    }

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)// solo lo pueda ver admin    
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Delete(':id')//address
    delete(@Param('id', ParseIntPipe) id: number){
      return this.addressService.delete(id);
    }
}
