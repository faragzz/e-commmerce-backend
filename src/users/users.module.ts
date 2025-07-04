import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {User,UserSchema} from "./schema/user.schema";
import {MongooseModule} from "@nestjs/mongoose";
import { UsersController } from './users.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    providers: [UsersService],
    exports: [UsersService],
    controllers: [UsersController]
})
export class UsersModule {
}
