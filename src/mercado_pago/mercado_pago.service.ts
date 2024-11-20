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

@Injectable()
export class MercadoPagoService {

    constructor(private readonly httpService: HttpService){}

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

    createPayment(paymentBody: PaymentBody): Observable<PaymentResponse>{
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
