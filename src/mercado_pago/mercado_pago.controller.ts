import { Controller, Get,UseGuards } from '@nestjs/common';
import { MercadoPagoService } from './mercado_pago.service';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRole } from 'src/auth/jwt/jwt-rol';

@Controller('mercadopago')
export class MercadoPagoController {

    constructor(private mercadoPagoService: MercadoPagoService){}

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Get('/identification_types')
    getIdentificationTypes(){
        return this.mercadoPagoService.getIdentificationTypes();
    }
}
