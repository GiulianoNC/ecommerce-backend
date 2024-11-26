import { Address } from "src/address/address.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderHasProducts } from './order_has_product.entity';

@Entity('orders')
export class Order{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_client: number;

    @Column()
    id_address: number

    @Column({default: 'PAGADO'})
    status: string
    

    @Column({ type:'datetime', default:() =>'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({ type:'datetime', default:() =>'CURRENT_TIMESTAMP'})
    updated_at: Date;

    @ManyToOne(() => User, (user)=> user.id)
    @JoinColumn({name:"id_client"})
    user: User

    @ManyToOne(() => Address, (address)=> address.id)
    @JoinColumn({name:"id_address"})
    address: Address

    @OneToMany(() => OrderHasProducts, (ohp) => ohp.order)
    @JoinColumn({ referencedColumnName: 'id_order' })
    orderHasProducts: OrderHasProducts[]
}