import {User} from "../users/schema/user.schema";
import {UserDTO} from "../users/dto/user";
import {BusinessDTO} from "../business/dto/business";
import {Business} from "../business/schema/business.schema";
import {UpdateBusinessProfileDTO} from "../business/dto/updateBusinessProfile.dto";
import {UpdateUserProfileDTO} from "../users/dto/updateUserProfile.dto";

export interface AuthServiceInterface {
    findOne(email: string): Promise<User | Business | null>;

    findByID(id: string): Promise<User | Business | null>;

    create(user: UserDTO | BusinessDTO): Promise<User | Business>;

    findAll(page?: number, limit?: number): Promise<{
        data: User[] | Business[];
        page: number;
        total: number;
        totalPages: number;
    }>;

    deleteAll(): Promise<void>;

    updateRefreshToken(email: string, refreshToken: string): Promise<User | Business | null>;

    updatePassword(email: string, password: string): Promise<User | Business | null>;

    logout(email: string): Promise<boolean | null>;

    editProfile(id: string, data: UpdateBusinessProfileDTO | UpdateUserProfileDTO): Promise<User | Business | null>;
}
