import pool from '../../config/db.js';

// Interfaces
import { RegisterInterface, LoginInterface, UpdateData, UserWithoutPassword , UserData} from './userInterface.js';

class UserRepository{
    async registerUser(data: RegisterInterface): Promise<UserWithoutPassword>{
        const {name, email, password, role} = data;

        const newUser = await pool.query(`
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4) RETURNING *;
            `, [name, email, password, role]);

        return newUser.rows[0];
    }

    // Find user by either the name or the email
    async findByNameOrEmail(data: LoginInterface): Promise<UserData>{
        const {name, email} = data;
        
        const user = await pool.query(`
            SELECT * FROM users WHERE name = $1 OR email = $2;
            `, [name, email]);

        return user.rows[0];
    }

    async updateProfile(userId: string, data: UpdateData): Promise<UserWithoutPassword | null>{
        const {name, password} = data;

        // Define fields to update with their respective values
        let fields: string[] = [];
        let values: any[] = [userId];

        let idx: number = 2;

        if (name){
            fields.push(`name = $${idx}`);
            values.push(name);
            idx++;
        }

        if (password){
            fields.push(`password = $${idx}`);
            values.push(password);
            idx++;
        }
        
        // If no fields where provided, return 'null'
        if (fields.length === 0){
            return null;
        }

        // Update profile only with the given values
        const updatedProfile = await pool.query(`
            UPDATE users SET ${fields.join(', ')} WHERE id = $1 RETURNING *;
            `, values);

        return updatedProfile.rows[0];
    }

    async allUsers(): Promise<UserWithoutPassword[]>{
        const allUsers = await pool.query(`
            SELECT * FROM users;
            `);
        return allUsers.rows;
    }

    async findUserById(userId: string): Promise<UserWithoutPassword>{
        const user = await pool.query(`
            SELECT * FROM users WHERE id = $1
            `, [userId]);
        return user.rows[0]
    } 

    async findUserByIdWithPassword(userId: string): Promise<UserData>{
        const user = await pool.query(`
            SELECT * FROM users WHERE id = $1`
            , [userId])
        return user.rows[0];
    }
}

export default new UserRepository();