import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ name, email, password: hashed });
    return this.userRepo.save(user);
  }

  async findAll() {
    return await this.userRepo.find();
  }

  async findActiveUsers() {
    return await this.userRepo.find({ where: { isActive: true } });
  }

  async findOne(id: string) {
    return await this.userRepo.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    return await this.userRepo.findOne({ where: { email } });
  }

  async toggleActive(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    user.isActive = !user.isActive;
    return this.userRepo.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
const updatedUser = Object.assign(user, updateUserDto);
    return await this.userRepo.save(updatedUser);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    user.isActive = false;
    return await this.userRepo.save(user);
  }
}
