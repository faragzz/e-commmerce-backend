import {IsEmail, IsNotEmpty, IsString} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class GenerateOtpDTO {
    @ApiProperty({
        example: 'user@example.com',
        description: 'The email address of the user',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'user',
        description: 'The role of the user (e.g., user, admin)',
    })
    @IsString()
    @IsNotEmpty()
    role: string;
}
