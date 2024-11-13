import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtRole } from 'src/auth/jwt/jwt-rol';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Logger } from '@nestjs/common';

@Controller('products')
export class ProductsController {
    CategoriesService: any;

    private readonly logger = new Logger(ProductsController.name);

    constructor(private productsService: ProductsService) {}

    //buscar todos los productos
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)  
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Get()
    findAll() {
    return this.productsService.findAll();
    } 

    //buscar por categoria
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)  
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Get('category/:id_category')
    findByCategory(@Param('id_category', ParseIntPipe) id_category:number) {
        return this.productsService.findByCategory(id_category);
    } 
    
        
    //CREAR PRODUCTO CON IMAGEN
    @HasRoles(JwtRole.ADMIN)// solo lo pueda ver admin    
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Post()//categories
    @UseInterceptors(FilesInterceptor('files[]',2))
    create(
        @UploadedFiles(
        new ParseFilePipe({
            //para que no envien imagenes muy grandes y de cualqueir tipo
            validators: [
              new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
              new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
            ],
          }),

    ) files: Array<Express.Multer.File>,//parametros
    @Body() product: CreateProductDto//parametros
    ) {
        return this.productsService.create(files, product);
    }
    

    //actualizar producto con imagen
    @HasRoles(JwtRole.ADMIN)// solo lo pueda ver admin    
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Put('upload/:id')//categories
    @UseInterceptors(FilesInterceptor('files[]',2))
    updateWithImage(
        @UploadedFiles(
        new ParseFilePipe({
            //para que no envien imagenes muy grandes y de cualqueir tipo
            validators: [
              new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
              new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
            ],
          }),

        )files: Array<Express.Multer.File>,//parametros
        @Param('id', ParseIntPipe) id: number,
        @Body() product: UpdateProductDto//parametros
    ) {
    

    this.logger.log(`Files received: ${files ? files.length : 'No files received'}`);

        files.forEach((file, index) => {
            this.logger.log(`File ${index + 1}: ${file.originalname}`);
        });

        return this.productsService.updateWithImages(files, id,product);
    } 

    //ACTUALIZAR
    @HasRoles(JwtRole.ADMIN)// solo lo pueda ver admin    
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() product: UpdateProductDto//parametros
    ) {
    return this.productsService.update(id,product);
    } 


    //ELIMINAR
    @HasRoles(JwtRole.ADMIN)// solo lo pueda ver admin    
    @UseGuards(JwtAuthGuard, JwtAuthGuard)//PARA PROTEGER ESTA RUTA 
    @Delete(':id')
    delete(
        @Param('id', ParseIntPipe) id: number,
    ) {
    return this.productsService.delete(id);
    } 
    
}
