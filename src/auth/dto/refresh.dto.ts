import {IsNotEmpty, IsString} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class RefreshDTO {
    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'The refresh token issued during login',
    })
    @IsString()
    @IsNotEmpty()
    refreshToken: string;

    @ApiProperty({
        example: 'user',
        description: 'The role of the user (e.g., user, admin)',
    })
    @IsString()
    @IsNotEmpty()
    role: string;
}
