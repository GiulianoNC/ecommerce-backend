import { IsNotEmpty, IsString } from "class-validator";

export class UpdateAddressDto{


    address:string;
    neighborhood:string;
    id_user:number;
}