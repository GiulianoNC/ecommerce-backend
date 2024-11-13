import { HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import storage = require('../utils/cloud_storage')
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import async_foreach = require('../utils/async_foreach');

@Injectable()
export class ProductsService {

    private readonly logger = new Logger(ProductsService.name);
    constructor(@InjectRepository(Product) private productsRepository: Repository<Product>){}
   
    findAll(){
        return this,this.productsRepository.find();
    }
    
    findByCategory(id_category: number){
        return this,this.productsRepository.findBy({id_category: id_category});
    }

    async create(files: Array<Express.Multer.File>, product: CreateProductDto){
        console.log('Files: '+ files.length);

        if(files.length === 0){
            throw new HttpException("Las imagenes son obligatorias", HttpStatus.NOT_FOUND);
        }

        let uploadedFiles = 0;// CUANTOS ARCHIVOS SE HAN SUBIDO A FIREBASE

        const newProduct = this.productsRepository.create(product);
        const savedProduct = await this.productsRepository.save(newProduct);
        
        const startForEach = async ()=> {
            await async_foreach(files, async(file: Express.Multer.File) => {
                const url = await storage(file, file.originalname);

                if(url !== undefined && url !== null){
                    if(uploadedFiles === 0){
                        savedProduct.image1 = url
                    }
                    else if(uploadedFiles === 1){
                        savedProduct.image2 = url
                    }
                }
                await this.update(savedProduct.id, savedProduct);
                uploadedFiles = uploadedFiles +1;
                
                console.log('uploaded files: ', uploadedFiles);
                console.log('flies lenght: ', files.length);
                
            })
        }
        await startForEach();
        return savedProduct;
    }

    async updateWithImages(
        files: Array<Express.Multer.File>,
        id: number,
        product: UpdateProductDto
    ) {
        console.log('Files: ' + files.length);
        this.logger.log(`Updating product with ID: ${id}`);
        this.logger.log(`Product Data: ${JSON.stringify(product)}`);
        this.logger.log(`Number of files received: ${files.length}`);
    
        if (!product.images_to_update || product.images_to_update.length === 0) {
            throw new HttpException('La propiedad images_to_update es obligatoria', HttpStatus.BAD_REQUEST);
        }
    
        if (files.length === 0) {
            throw new HttpException('Las imágenes son obligatorias', HttpStatus.NOT_FOUND);
        }
    
        let counter = 0;
    
        // Verifica que `counter` esté dentro de los límites de `images_to_update`
        if (counter >= product.images_to_update.length) {
            throw new HttpException(
                'El índice "counter" está fuera de los límites de images_to_update',
                HttpStatus.BAD_REQUEST
            );
        }
    
        let uploadedFiles = Number(product.images_to_update[counter]);
    
        const updateProduct = await this.update(id, product);
    
        const startForEach = async () => {
            await async_foreach(files, async (file: Express.Multer.File) => {
                try {
                    const url = await storage(file, file.originalname);
                    if (url) {
                        if (uploadedFiles === 0) updateProduct.image1 = url;
                        else if (uploadedFiles === 1) updateProduct.image2 = url;
                    }
                } catch (error) {
                    console.error("Error uploading file:", error);
                }
                
    
                await this.update(updateProduct.id, updateProduct);
                counter++;
    
                // Asegúrate de que `counter` esté dentro de los límites de `images_to_update`
                if (counter < product.images_to_update.length) {
                    uploadedFiles = Number(product.images_to_update[counter]);
                } else {
                    uploadedFiles = 0; // O cualquier valor por defecto
                }
    
                console.log('uploaded files: ', uploadedFiles);
                console.log('files length: ', files.length);
            });
        };
    
        await startForEach();
        return updateProduct;
    }
    
      
    async update(id:number, product:UpdateProductDto){

        const ProductFound = await this.productsRepository.findOneBy({id:id});

        if(!ProductFound){
            throw new HttpException('Product no encontrado', HttpStatus.NOT_FOUND);
        }

        const updateProduct = Object.assign(ProductFound, product);
        return this.productsRepository.save(updateProduct);
    }

    async delete(id:number){

        const ProductFound = await this.productsRepository.findOneBy({id:id});

        if(!ProductFound){
            throw new HttpException('Product no encontrado', HttpStatus.NOT_FOUND);
        }
         return this.productsRepository.delete(id);
    }
}
