import {  Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToMany, JoinTable } from "typeorm";
import { hash} from "bcrypt";
import { Rol } from "src/roles/rol.entity";

@Entity({name: 'users'})//nombre de la tabla
export class User{
    //atributos de la tabla

    @PrimaryGeneratedColumn()
    id: number;// llave primaria

    @Column()
    name: string;

    @Column()
    lastname: string;

    @Column({unique:true})
    email: string;

    @Column({unique:true})
    phone: string;

    @Column({nullable:true})
    image: string;

    @Column()
    password: string;

    @Column({nullable:true})
    notification_token: string;

    @Column({ type:'datetime', default:() =>'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({ type:'datetime', default:() =>'CURRENT_TIMESTAMP'})
    updated_at: Date;

    //estamos defininiendo que es la tabla principal de la relacion
    @JoinTable({
        name: 'user_has_roles',//acá loe stamos nombrando
        joinColumn: {
            name:'id_user'//aca nombramos las columnas
        },
        inverseJoinColumn:{
            name: 'id_rol'
        }
    }
    )
    //definimos la relacion de roles con usuarios
    @ManyToMany(( )=> Rol, (rol)=> rol.users)
    roles: Rol[];

    //vamos a encriptar el password
    @BeforeInsert()
    async hashPassword(){
        this.password = await hash(this.password, Number(process.env.HASH_SALT));
    }


}