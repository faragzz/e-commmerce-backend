import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY, ROLES_KEY } from '../decorators/roles';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesGuard implements CanActivate {
    private readonly logger = new Logger(RolesGuard.name);

    constructor(
      private reflector: Reflector,
      private jwtService: JwtService,
      private configService: ConfigService,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        this.logger.log('RolesGuard triggered');

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            this.logger.log('Route is public');
            return true;
        }

        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        this.logger.log(`Required roles: ${requiredRoles}`);

        if (!requiredRoles || requiredRoles.length === 0) return true;

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            this.logger.warn('Missing or malformed Authorization header');
            throw new UnauthorizedException('Missing or malformed authorization header');
        }

        const token = authHeader.replace('Bearer ', '').trim();
        this.logger.log(`Extracted token: ${token}`);

        try {
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });
            console.log('🛡 RolesGuard: Required roles =', requiredRoles);
            console.log('🛡 RolesGuard: Payload =', request.user);

            this.logger.log(`Token payload: ${JSON.stringify(payload)}`);
            request.user = payload;

            if (!payload.role) {
                this.logger.warn('Token payload missing "role"');
                throw new UnauthorizedException('Token missing role');
            }

            const hasRole = requiredRoles.includes(payload.role);
            this.logger.log(`User role is "${payload.role}". Access granted: ${hasRole}`);
            return hasRole;
        } catch (err) {
            this.logger.error('JWT verification failed:', err.message);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
