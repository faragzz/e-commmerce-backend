import {
    Controller,
    Put,
    Param,
    Body,
    NotFoundException,
    HttpCode,
    Get,
    Query,
    HttpStatus,
    Delete
} from '@nestjs/common';
import {UsersService} from './users.service';
import {User} from './schema/user.schema';
import {ApiTags, ApiOperation, ApiResponse, ApiNotFoundResponse, ApiBody, ApiQuery} from '@nestjs/swagger';
import {UpdateUserProfileDTO} from "./dto/updateUserProfile.dto";
import {Public} from "../auth/decorators/roles";
import {FindAllUserDto} from "./dto/findAll.dto";

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @ApiOperation({summary: 'Get all users (paginated)'})
    @ApiQuery({name: 'page', required: false, type: Number, description: 'Page number (starts from 1)'})
    @ApiQuery({name: 'limit', required: false, type: Number, description: 'Number of items per page'})
    @Public()
    @HttpCode(HttpStatus.OK)
    @Get('users')
    getAll(@Query() query: FindAllUserDto) {
        return this.usersService.findAll(query.page, query.limit);
    }

    @Put(':id/profile')
    @ApiOperation({summary: 'Update user profile'})
    @ApiResponse({status: 200, description: 'Profile updated successfully', type: User})
    @ApiNotFoundResponse({description: 'User not found'})
    @ApiBody({type: UpdateUserProfileDTO})
    async updateProfile(
        @Param('id') id: string,
        @Body() data: UpdateUserProfileDTO
    ): Promise<User> {
        const updatedUser = await this.usersService.editProfile(id, data);
        if (!updatedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return updatedUser;
    }

    @ApiOperation({summary: 'Delete all users (for testing or admin)'})
    @Public()
    @HttpCode(HttpStatus.OK)
    @Delete('delete-all')
    async deleteAll() {
        return this.usersService.deleteAll();
    }

}
