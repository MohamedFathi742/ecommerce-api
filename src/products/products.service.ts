import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const newProduct = await this.productRepo.create(createProductDto as any);
    return await this.productRepo.save(newProduct);
  }

  async findAll() {
    return await this.productRepo.find();
  }

  async findOne(id: string) {
    return await this.productRepo.findOne({ where: { id } });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    if (!product) {
      throw new Error('Product not found');
    }
    const updatedProduct = Object.assign(product, updateProductDto);
    return await this.productRepo.save(updatedProduct);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return await this.productRepo.delete(id);
  }
}
