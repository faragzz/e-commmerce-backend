import {Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";

@Injectable()
export class ServiceByRole {
    constructor(
        private usersService: UsersService,
    ) {
    }

    getServiceByRole(role: string) {
        if (role === 'user' || role === 'admin') return this.usersService;
        throw new Error('Unsupported role');
    }


}
