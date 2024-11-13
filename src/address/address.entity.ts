import { User } from "src/users/user.entity";
import { Column, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from "typeorm/decorator/entity/Entity";

@Entity({name:'address'})
export class Address{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    address: string;

    @Column()
    neighborhood: string;

    @Column({ type:'datetime', default:() =>'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({ type:'datetime', default:() =>'CURRENT_TIMESTAMP'})
    updated_at: Date;  

    @Column()
    id_user: number;

    @ManyToOne(() => User, (user) => user.id) 
    @JoinColumn({name: 'id_user'})
    user: User;

}