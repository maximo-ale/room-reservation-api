import createToken from '../../utils/createToken.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';
import userRepository from './userRepository.js';
import bcrypt from 'bcrypt';

interface UserData{
    name: string,
    email: string,
    password: string,
    role?: 'user' | 'admin',
}

interface UpdateProfile{
    newName?: string,
    newPassword?: string,
    oldPassword?: string,
}

interface UserWithoutPassword{
    id: number,
    name: string,
    email: string,
    role?: string,
}

interface UserWithToken{
    user: UserWithoutPassword,
    token: string,
}

class UserService{
    async register(data: UserData): Promise<UserWithToken>{
        const {name, email, password, role} = data;
        
        // Hash password to protect sensitive info
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with role 'user' if role is not provided
        const newUser = await userRepository.registerUser({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        // Generate user token and return it
        const token = createToken({user_id: newUser.id});
        return {user: newUser, token};
    }

    async login(data: UserData): Promise<UserWithToken>{
        const {name, email, password} = data;

        // DB finds the user with either the name or the email
        if (!name && !email){
            throw new BadRequestError('At least name or email must be provided');
        }

        const user = await userRepository.findByNameOrEmail({name, email});
        if (!user){
            throw new NotFoundError('User not found');
        }

        // Compare given password with the hashed one
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            throw new BadRequestError('Wrong password');
        }

        // Generate user token
        const token = createToken({user_id: user.id});
        
        return {user, token};
    }

    // Get user profile without providing the password
    async getProfile(user_id: number): Promise<UserWithoutPassword>{
        const profile = await userRepository.findUserById(user_id);

        return profile;
    }

    async updateProfile(user_id: number, data: UpdateProfile): Promise<UserWithoutPassword>{
        const {newName, newPassword, oldPassword} = data;

        const updates: {name?: string, password?: string} = {};

        const user = await userRepository.findUserByIdWithPassword(user_id);
        
        // Update user's name
        if (newName){
            updates.name = newName;
        }

        // Set 'newPassword' as the new password if 'oldPassword' matches the old one
        if (newPassword && oldPassword){
            const isMatch: boolean = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch){
                throw new BadRequestError('Old password does not macth');
            }

            const hashedPassword: string = await bcrypt.hash(newPassword, 10);
            updates.password = hashedPassword;
        }

        const updatedProfile = await userRepository.updateProfile(user_id, updates);

        if (!updatedProfile){
            throw new BadRequestError('No values given');
        }

        return updatedProfile;
    }

    async getAllUsers(): Promise<UserWithoutPassword[]>{
        const allUsers = await userRepository.allUsers();
        return allUsers;
    }
}

export default new UserService();