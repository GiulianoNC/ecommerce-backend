import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Order } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {

    constructor(@InjectRepository(Order) private ordersRepository: Repository<Order>){}

        //metodos que nos permitan obtener la informacaion que guardamois en la bd

        findAll(){
            return this.ordersRepository.find({relations: ['user','address','orderHasProducts.product']})
        }

        findByClient(idClient: number){
            return this.ordersRepository.find({
                relations: ['user','address','orderHasProducts.product'],
                where:{id_client: idClient }            
            })
        }

        async updateStatus(id: number) {
            const orderFound = await this.ordersRepository.findOneBy({id: id});
            if (!orderFound) {
                throw new HttpException('Orden no encontrada', HttpStatus.NOT_FOUND);
            }
            const updatedOrder = Object.assign(orderFound, { status: 'DESPACHADO' });
            return this.ordersRepository.save(updatedOrder);
        }
    
}
