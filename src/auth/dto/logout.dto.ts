import { IsEmail, IsNotEmpty } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class logoutDTO {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user who is logging out',
  })
  @IsEmail()
  @IsNotEmpty()
  userId: string
}
