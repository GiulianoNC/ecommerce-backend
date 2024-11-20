import { Body, Controller, Get,Param,ParseIntPipe,Post,UseGuards } from '@nestjs/common';
import { MercadoPagoService } from './mercado_pago.service';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRole } from 'src/auth/jwt/jwt-rol';
import { CardTokenBody } from './models/card_token_body';
import { PaymentBody } from './models/payment_body';

@Controller('mercadopago')
export class MercadoPagoController {

    constructor(private mercadoPagoService: MercadoPagoService){}

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Get('/identification_types')
    getIdentificationTypes(){
        return this.mercadoPagoService.getIdentificationTypes();
    }

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Get('installments/:first_six_digits/:amount')
    getInstallments(
        @Param('first_six_digits', ParseIntPipe)firstSixDigits:number,
        @Param('amount', ParseIntPipe)amount:number
    ){
        return this.mercadoPagoService.getInstallments(firstSixDigits, amount);
    }

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Post('card_token')
    createCardToken(@Body()cardTokenBody:CardTokenBody){
        return this.mercadoPagoService.createrCardToken(cardTokenBody);
    }

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Post('payments')
    createPayment(@Body()paymentBody:PaymentBody){
        return this.mercadoPagoService.createPayment(paymentBody);
    }
}
