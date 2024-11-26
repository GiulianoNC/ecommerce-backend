import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderHasProducts } from './order_has_product.entity';
import { User } from 'src/users/user.entity';
import { Address } from 'src/address/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderHasProducts,User,Address])],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
