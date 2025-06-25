import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class VerifyOtpDTO {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address used to receive the OTP',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'The OTP token sent to the user\'s email',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: 'user',
    description: 'The role of the user (e.g., user, admin)',
  })
  @IsString()
  @IsNotEmpty()
  role: string;
}
