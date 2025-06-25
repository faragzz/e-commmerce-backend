import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import {UserDTO} from '../users/dto/user';
import {User, UserDocument} from '../users/schema/user.schema';
import {EmailService} from '../email/email.service';
import * as speakeasy from 'speakeasy';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {AuthServiceInterface} from "./AuthServiceInterface";
import {Business, BusinessDocument} from "../business/schema/business.schema";
import {BusinessService} from "../business/business.service";
import {BusinessDTO} from "../business/dto/business";
import {verifyEmailTemplate} from "../email/templates/verify-email";
import {verifiedEmailHtml} from "../email/templates/success-email-verification";
import {verificationFailedHtml} from "../email/templates/failure-email-verification";
import {EmailVerificationGateway} from "./auth.gateway";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private mailService: EmailService,
        private emailVerificationGateway: EmailVerificationGateway,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(User.name) private readonly businessModel: Model<BusinessDocument>
    ) {
    }

    async signIn(email: string, pass: string, service: AuthServiceInterface): Promise<{
        access_token: String,
        refresh_token: String
    }> {
        const user = await service.findOne(email);
        if (!user) throw new UnauthorizedException();
        if (!(await bcrypt.compare(pass, user.password))) {
            throw new UnauthorizedException();
        }
        const access_token = this.generateAccessToken(user);
        const refresh_token = this.generateRefreshToken(user);
        await this.updateRefreshToken(user.email, refresh_token, service);
        return {access_token, refresh_token};
    }

    async register(user: UserDTO | BusinessDTO, service: AuthServiceInterface): Promise<User | Business> {
        const createdUser = await service.create(user);
        if (!createdUser) throw new UnauthorizedException();
        // try {
        //   await this.mailService.sendMail(
        //     createdUser.email,
        //     "Created Account in Pet's App",
        //     "Welcome to Pet's App!"
        //   );
        // } catch (error) {
        //   console.error("⚠️ Failed to send welcome email:", error.message);
        // }
        return createdUser;
    }

    private generateAccessToken(user: any) {
        return this.jwtService.sign(
            {sub: user.id, username: user.username, role: user.role},
            {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: '15m',
            },
        );
    }

    private generateRefreshToken(user: any) {
        return this.jwtService.sign(
            {sub: user.id, username: user.username, role: user.role},
            {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: '7d',
            },
        );
    }

    async updateRefreshToken(id: string, refreshToken: string, service: AuthServiceInterface) {
        const hashedToken = await bcrypt.hash(refreshToken, 10);
        const user = await service.updateRefreshToken(id, hashedToken);
        console.log("updated_user ", user);
    }

    async refreshTokens(refreshToken: string, service: AuthServiceInterface) {
        try {
            const decoded = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });

            // ✅ Find the user in-memory
            const user = await service.findByID(decoded.sub);
            console.log("decoded.sub ", decoded, " user found ", user);
            if (!user || !(await bcrypt.compare(refreshToken, user.refreshToken ?? ""))) {
                throw new UnauthorizedException('Invalid refresh token');
            }
            // ✅ Generate new tokens
            const accessToken = this.generateAccessToken(user);
            const newRefreshToken = this.generateRefreshToken(user);

            // ✅ Update the user's refresh token in-memory
            await service.updateRefreshToken(user.email, newRefreshToken);

            return {access_token: accessToken, refresh_token: newRefreshToken};
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

    async generateOTP(email: string, role: string) {

        const secret = speakeasy.generateSecret({length: 20});
        const token = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32',
            step: 60,
        });

        let user: any;
        if (role == 'business') user = await this.businessModel.findOne({email});
        else user = await this.userModel.findOne({email});
        if (!user) {
            console.error("User not found.");
            return {error: "User not found"};
        }
        user.otp_key = secret.base32;
        await user.save();

        try {
            await this.mailService.sendMail(
                user.email,
                "Recover your Pet's Account",
                {text: `OTP: ${token}`}
            );
        } catch (error) {
            console.error("⚠️ Failed to send OTP:", error.message);
        }

        return {message: "OTP sent successfully"};
    }

    async sendEmailVerification(email: string, role: string) {

        const secret = speakeasy.generateSecret({length: 20});
        const token = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32',
            step: 60,
        });

        let user: any;
        if (role == 'business') user = await this.businessModel.findOne({email});
        else user = await this.userModel.findOne({email});
        if (!user) {
            console.error("User not found.");
            return {error: "User not found"};
        }
        user.emailVerificationToken = secret.base32;
        await user.save();

        try {
            await this.mailService.sendMail(
                user.email,
                "Verify your Account",
                {html: verifyEmailTemplate(token, user.username, email, role)}
            );
        } catch (error) {
            console.error("⚠️ Failed to send verification email:", error.message);
        }
        return {message: "Verification email sent successfully"};
    }

    async verifyOTP(email: string, token: string, service: AuthServiceInterface) {
        let user: any;
        if (service instanceof BusinessService) user = await this.businessModel.findOne({email});
        else user = await this.userModel.findOne({email});

        if (!user) {
            console.error("User not found.");
            return {error: "User not found"};
        }

        if (!user.otp_key) {
            console.error("OTP key missing.");
            return {error: "No OTP key found for user"};
        }
        const verified = speakeasy.totp.verifyDelta({
            secret: user.otp_key,
            encoding: "base32",
            token,
            window: 2,
            step: 60
        });

        if (!verified) {
            console.error("❌ Invalid OTP.");
            return {error: "Invalid or expired OTP"};
        }

        // Generate tokens if OTP is valid
        const access_token = this.generateAccessToken(user);
        const refresh_token = this.generateRefreshToken(user);

        await this.updateRefreshToken(user.email, refresh_token, service);

        return {access_token, refresh_token};
    }

    async verifyEmailToken(email: string, token: string,role:string, service: AuthServiceInterface) {
        const user = await service.findOne(email);
        if (!user) {
            console.error("User not found.");
            return {error: "User not found"};
        }
        if (!user.emailVerificationToken) {
            console.error("emailVerificationToken key missing.");
            this.emailVerificationGateway.sendVerificationStatusUpdate(user.email,user.isEmailVerified);
            return {error: "No emailVerificationToken key found for user"};
        }
        const verified = speakeasy.totp.verifyDelta({
            secret: user.emailVerificationToken,
            encoding: "base32",
            token,
            window: 2,
            step: 60
        });
        if (!verified) {
            console.error("❌ Invalid emailVerificationToken.");
            return verificationFailedHtml(user.email,role);
        }
        user.isEmailVerified = true;
        await (user as any).save();
        this.emailVerificationGateway.sendVerificationStatusUpdate(user.email,user.isEmailVerified);
        return verifiedEmailHtml(user.username);
    }

    async logout(userId: string, service: AuthServiceInterface) {
        return service.logout(userId);
    }
}