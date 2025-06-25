import { IsOptional, IsString, MaxLength, IsPhoneNumber, IsEmail, MinLength, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserProfileDTO {
    @ApiPropertyOptional({ example: 'Ahmed Khaled' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    username?: string;

    @ApiPropertyOptional({ example: '+201234567890' })
    @IsOptional()
    @IsPhoneNumber('EG')
    phone?: string;

    @ApiPropertyOptional({ example: 'ahmed@example.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: 'Password123' })
    @IsOptional()
    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]/, {
        message: 'Password must contain letters and numbers',
    })
    password?: string;
}
