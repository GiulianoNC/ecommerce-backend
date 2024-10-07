import { User } from "src/users/user.entity";
import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";

@Entity({name: 'roles'})
export class Rol{

    @PrimaryColumn({unique: true})
    id: string;

    @Column()
    name: string;

    @Column()
    image: string;

    @Column()
    route: string;
    
    @Column({ type:'datetime', default:() =>'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({ type:'datetime', default:() =>'CURRENT_TIMESTAMP'})
    updated_at: Date;    

    //necesitamos pasarle dos funciones, debe indicar la entidad con la cual
    //vamos a relacionar, en este caso user y una funciona que te retorna un usuario que se relacion con el campor roles  
    @ManyToMany(() => User, (user) => user.roles )
    users: User[]
}