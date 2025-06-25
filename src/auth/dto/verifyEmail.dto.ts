import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDTO {
    @ApiProperty({
        example: 'user@example.com',
        description: 'The email address to be verified.',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'f8a9c6e2d4b7a9a8b3c6d7f9e1a2b3c4',
        description: 'The unique verification token sent to the user\'s email.',
    })
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({
        example: 'user',
        description: 'The role of the user (e.g., user, admin, business).',
    })
    @IsString()
    @IsNotEmpty()
    role: string;
}
