import {Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {BusinessService} from "../business/business.service";

@Injectable()
export class ServiceByRole {
    constructor(
        private usersService: UsersService,
        private businessService: BusinessService,
    ) {
    }

    getServiceByRole(role: string) {
        if (role === 'user' || role === 'admin') return this.usersService;
        else if (role === 'business') return this.businessService;
        throw new Error('Unsupported role');
    }


}
