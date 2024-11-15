import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, map, Observable } from 'rxjs';
import { IdenticationType } from './models/identification_type';
import { MERCADO_PAGO_API, MERCADO_PAGO_HEADERS } from 'src/config/config';

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

}
