import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private repo: Repository<Order>,
    private usersSvc: UsersService,
    private productsSvc: ProductsService,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const user = await this.usersSvc.findOne(createOrderDto.userId);
    if (!user) {
      throw new Error('User not found');
    }
    const product = await this.productsSvc.findOne(createOrderDto.productId);
    if (!product) {
      throw new Error('Product not found');
    }
    const order = this.repo.create({
      quantity: createOrderDto.quantity,
      user,
      product,
    });
    return await this.repo.save(order);
  }

async  findAll() {
    return await this.repo.find({ relations: ['user', 'product'] });
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['user', 'product'] });
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = this.findOne(id);
    if (!order) {
      throw new Error('Order not found');
    }
    const updatedOrder = Object.assign(order, updateOrderDto);
    return this.repo.save(updatedOrder);
  }

  remove(id: string) {
    const order = this.findOne(id);
    if (!order) {
      throw new Error('Order not found');
    }
    return this.repo.delete(id);
  }
}
