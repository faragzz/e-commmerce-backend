import {Body, Controller, Post, Request, HttpCode, HttpStatus, Get, Delete, Query} from '@nestjs/common';
import {AuthService} from './auth.service';
import {Public} from './decorators/roles';
import {UserDTO} from '../users/dto/user';
import {UsersService} from '../users/users.service';
import {User} from '../users/schema/user.schema';
import {SignInDTO} from './dto/signInDTO.dto';
import {GenerateOtpDTO} from './dto/generateOTP.dto';
import {RefreshDTO} from './dto/refresh.dto';
import {VerifyOtpDTO} from './dto/verifyOTP.dto';
import {logoutDTO} from './dto/logout.dto';
import {ServiceByRole} from "./RoleServiceFactory";
import {ApiBody, ApiOperation, ApiQuery, ApiTags} from "@nestjs/swagger";
import {VerifyEmailDTO} from "./dto/verifyEmail.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
                private serviceByRole: ServiceByRole,
                private userService: UsersService) {
    }

    @ApiOperation({summary: 'Sign in a user by email and password'})
    @ApiBody({type: SignInDTO})
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: SignInDTO) {
        const service = this.serviceByRole.getServiceByRole(signInDto.role);
        return this.authService.signIn(signInDto.email, signInDto.password, service);
    }

    @ApiOperation({summary: 'Register a new user or business'})
    @ApiBody({type: UserDTO})
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('register')
    register(@Body() user: UserDTO): Promise<User> {
        const service = this.serviceByRole.getServiceByRole(user.role);
        console.log("service ", service, " role passed ", user.role);
        return this.authService.register(user, service);
    }

    @ApiOperation({summary: 'Generate OTP for login or registration'})
    @ApiBody({type: GenerateOtpDTO})
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('generate-otp')
    async generateOTP(@Body() body: GenerateOtpDTO) {
        return this.authService.generateOTP(body.email, body.role);
    }

    @ApiOperation({summary: 'Verify OTP sent to user'})
    @ApiBody({type: VerifyOtpDTO})
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('verify-otp')
    async verifyOTP(@Body() body: VerifyOtpDTO) {
        const service = this.serviceByRole.getServiceByRole(body.role);
        return this.authService.verifyOTP(body.email, body.token, service);
    }

    @ApiOperation({summary: 'Update password by email'})
    @ApiBody({type: SignInDTO})
    @Post('update-password')
    async updatePassword(@Body() body: SignInDTO) {
        return this.userService.updatePassword(body.email, body.password);
    }

    @ApiOperation({summary: 'Refresh JWT access token using refresh token'})
    @ApiBody({type: RefreshDTO})
    @Public()
    @Post('refreshToken')
    async refresh(@Body() body: RefreshDTO) {
        const service = this.serviceByRole.getServiceByRole(body.role);
        return this.authService.refreshTokens(body.refreshToken, service);
    }

    @ApiOperation({ summary: 'Send email verification link to user' })
    @ApiQuery({
        name: 'email',
        type: String,
        required: true,
        description: 'The email address of the user',
    })
    @ApiQuery({
        name: 'role',
        type: String,
        required: true,
        description: 'The role of the user (e.g., user, admin)',
    })
    @Public()
    @Get('send-verification-email')
    async sendEmailVerification(@Query() query: GenerateOtpDTO) {
        return this.authService.sendEmailVerification(query.email, query.role);
    }

    @Public()
    @ApiOperation({ summary: 'Verify user email using token' })
    @ApiQuery({ name: 'email', type: String, example: 'user@example.com', description: 'The email address to be verified.' })
    @ApiQuery({ name: 'token', type: String, example: 'f8a9c6e2d4b7a9a8b3c6d7f9e1a2b3c4', description: 'The verification token sent to the user\'s email.' })
    @ApiQuery({ name: 'role', type: String, example: 'user', description: 'The role of the user (e.g., user, admin, business).' })
    @Get('verify-email')
    async verifyEmail(@Query() query: VerifyEmailDTO) {
        const service = this.serviceByRole.getServiceByRole(query.role);
        return this.authService.verifyEmailToken(query.email, query.token, query.role, service);
    }

    @ApiOperation({summary: 'Logout user and invalidate token'})
    @ApiBody({type: logoutDTO})
    @Post('logout')
    async logout(@Request() req: any, @Body() body: logoutDTO) {
        const {role} = req.user;
        const service = this.serviceByRole.getServiceByRole(role);
        return this.authService.logout(body.userId, service);
    }

    // @Get('profile')
    // getProfile(@Request() req) {
    //     return req.user;
    // }
}
