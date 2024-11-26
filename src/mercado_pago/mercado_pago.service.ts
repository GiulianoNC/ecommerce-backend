import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, map, Observable } from 'rxjs';
import { IdenticationType } from './models/identification_type';
import { MERCADO_PAGO_API, MERCADO_PAGO_HEADERS } from 'src/config/config';
import { CardTokenBody } from './models/card_token_body';
import { CardTokenResponse } from './models/card_token_response';
import { Installment } from './models/installment';
import { PaymentBody } from './models/payment_body';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/orders/order.entity';
import { OrderHasProducts } from 'src/orders/order_has_product.entity';

@Injectable()
export class MercadoPagoService {

    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(Order) private ordersRespository: Repository<Order>,
        @InjectRepository(OrderHasProducts) private ordersHasProductsRepository: Repository<OrderHasProducts>
    ){}

    getIdentificationTypes(): Observable<AxiosResponse<IdenticationType[]>>{
        return this.httpService.get(MERCADO_PAGO_API + '/identification_types',{headers: MERCADO_PAGO_HEADERS}).pipe(
            catchError((error: AxiosError) =>{
                throw new HttpException(error.response.data, error.response.status)
            })
        ).pipe(map((resp) => resp.data));
    }

    //NUMERO DE CUOTAS
    getInstallments(firstSixDigits: number, amount: number): Observable<Installment> {
        return this.httpService.get(MERCADO_PAGO_API + `/payment_methods/installments?bin=${firstSixDigits}&amount=${amount}`, { headers: MERCADO_PAGO_HEADERS }).pipe(
            catchError((error: AxiosError) => {
                throw new HttpException(error.response.data, error.response.status);
            })
        ).pipe(map((resp: AxiosResponse<Installment>) => resp.data[0]));
    }


    createrCardToken(cardTokenBody: CardTokenBody): Observable<CardTokenResponse>{
        return this.httpService.post(
            MERCADO_PAGO_API + '/card_tokens?public_key=TEST-b6d27bdc-3dfe-401d-924c-1577fcc0698f',
            cardTokenBody,
            {headers: MERCADO_PAGO_HEADERS}
        ).pipe(
            catchError((error: AxiosError) =>{
                throw new HttpException(error.response.data, error.response.status)
            })
        ).pipe(map((resp: AxiosResponse<CardTokenResponse>) => resp.data));
    }

    async createPayment(paymentBody: PaymentBody): Promise<Observable<PaymentResponse>>{

        const newOrder = this.ordersRespository.create(paymentBody.order);
        const saveorder =await this.ordersRespository.save(newOrder);
        
        //crear la info en la bd
        for(const product of paymentBody.order.products){
            const ohp = new OrderHasProducts();
            ohp.id_order = saveorder.id;
            ohp.id_product = product.id;
            ohp.quantity = product.quantity;
            await this.ordersHasProductsRepository.save(ohp)
        }
        delete paymentBody.order;

        return this.httpService.post(
            MERCADO_PAGO_API + '/payments',
            paymentBody,
            {headers: MERCADO_PAGO_HEADERS}
        ).pipe(
            catchError((error: AxiosError) =>{
                throw new HttpException(error.response.data, error.response.status)
            })
        ).pipe(map((resp: AxiosResponse<PaymentResponse>) => resp.data));
    }

}
