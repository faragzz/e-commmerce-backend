import {IsString, IsEmail} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class SignInDTO {
    @ApiProperty({
        example: 'user@example.com',
        description: 'The email address of the user',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'strongPassword123',
        description: 'The user’s password',
    })
    @IsString()
    password: string;

    @ApiProperty({
        example: 'user',
        description: 'The role of the user (e.g., user, admin)',
    })

    @IsString()
    role: string;
}
