import { IsUUID, IsNumber } from 'class-validator';
export class CreateOrderDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  productId: string;

  @IsNumber()
  quantity: number;
}
