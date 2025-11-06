import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ default: true })
  isActive: boolean;
  @Column({ default: 'user' })
  role: string;
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
