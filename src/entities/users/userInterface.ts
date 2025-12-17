export interface RegisterInterface{
    name: string,
    email: string,
    password: string,
    role: string,
}

export interface LoginInterface{
    name?: string,
    email?: string,
}

export interface UpdateData{
    name?: string,
    password?: string,
}

// TODO: Separate between "CreateUserData" and "UserData" (role cannot be optional in "UserData")

export interface UpdateProfile{
    newName?: string,
    oldPassword?: string,
    newPassword?: string,
}

export interface UserData{
    userId: string,
    name: string,
    email: string,
    password: string,
    role: 'user' | 'admin',
}

export interface UserWithToken{
    user: UserWithoutPassword,
    token: string,
}

export interface UserWithoutPassword{
    userId: string,
    name: string,
    email: string,
    role: 'user' | 'admin',
}