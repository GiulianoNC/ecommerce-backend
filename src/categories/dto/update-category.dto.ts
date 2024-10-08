import { IsNotEmpty, isNotEmpty, IsString, isString } from "class-validator";

export class UpdateCategoryDto{

    //@IsNotEmpty()
    //@IsString()
    name?: string;
    

    //@IsNotEmpty()
    //@IsString()
    description?: string;

    
    image?: string;
}