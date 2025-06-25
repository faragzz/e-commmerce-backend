import {User} from "../users/schema/user.schema";
import {UserDTO} from "../users/dto/user";
import {UpdateUserProfileDTO} from "../users/dto/updateUserProfile.dto";

export interface AuthServiceInterface {
    findOne(email: string): Promise<User | null>;

    findByID(id: string): Promise<User | null>;

    create(user: UserDTO): Promise<User>;

    findAll(page?: number, limit?: number): Promise<{
        data: User[];
        page: number;
        total: number;
        totalPages: number;
    }>;

    deleteAll(): Promise<void>;

    updateRefreshToken(email: string, refreshToken: string): Promise<User | null>;

    updatePassword(email: string, password: string): Promise<User | null>;

    logout(email: string): Promise<boolean | null>;

    editProfile(id: string, data: UpdateUserProfileDTO): Promise<User | null>;
}
