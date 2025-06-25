import { IsString, IsEmail, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

type Role = 'admin' | 'user' | 'business';

export class UserDTO {
    @ApiProperty({ example: 'john_doe', description: 'The unique username for the account' })
    @IsString()
    username: string;

    @ApiProperty({ example: 'john@example.com', description: 'Valid email address of the user' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'StrongPass123!', description: 'User password (min 8 characters recommended)' })
    @IsString()
    password: string;

    @ApiProperty({ example: '+201234567890', description: 'User phone number with country code' })
    @IsString()
    phone: string;

    @ApiProperty({
        example: 'user',
        description: 'Role of the registering account (e.g., user, business, admin)',
        enum: ['admin', 'user', 'business']
    })
    @IsString()
    role: Role;

    @ApiPropertyOptional({ example: null, description: 'Refresh token (optional, usually set post-login)' })
    @IsOptional()
    @IsString()
    refreshToken: string | null;

    @ApiPropertyOptional({ example: null, description: 'OTP for email or phone verification (optional)' })
    @IsOptional()
    @IsString()
    otp: string | null;

    @ApiPropertyOptional({ example: new Date().toISOString(), description: 'Date of creation (optional)' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @ApiPropertyOptional({ example: new Date().toISOString(), description: 'Last update date (optional)' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    updatedAt: Date;
}
