import { Controller, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRole } from 'src/auth/jwt/jwt-rol';
import { Order } from './order.entity';

@Controller('orders')
export class OrdersController {

    constructor(private OrdersService: OrdersService){}

    @HasRoles(JwtRole.ADMIN)// solo lo pueda ver admin    
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Get()
    finAll(){
      return this.OrdersService.findAll();
    }

    @HasRoles(JwtRole.CLIENT,JwtRole.ADMIN)// solo lo pueda ver admin    
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Get(':id_client')
    finByClient(@Param('id_client', ParseIntPipe)idClient: number){
      return this.OrdersService.findByClient(idClient);
    }

    @HasRoles(JwtRole.ADMIN)// solo lo pueda ver admin    
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Put('updateToDispatched/:id')
    updateStatus(@Param('id', ParseIntPipe)id: number){
      return this.OrdersService.updateStatus(id);
    }
}
