import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UsersModule} from '../users/users.module';
import {JwtModule} from '@nestjs/jwt';
import {AuthGuard} from './Guards/auth.guard';
import {APP_GUARD} from '@nestjs/core';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {EmailModule} from '../email/email.module';
import {User, UserSchema} from '../users/schema/user.schema';
import {MongooseModule} from '@nestjs/mongoose';
import {ServiceByRole} from "./RoleServiceFactory";
import {BusinessModule} from "../business/business.module";
import {EmailVerificationGateway} from "./auth.gateway";

@Module({

    imports: [UsersModule,
        BusinessModule,
        EmailModule,
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {expiresIn: '1h'},
            }),
        })],
    controllers: [AuthController],
    providers: [{
        provide: APP_GUARD,
        useClass: AuthGuard,
    }, AuthService, ServiceByRole,EmailVerificationGateway],
})
export class AuthModule {
}
