import jwt from 'jsonwebtoken';

interface PayloadData{
    user_id: number | string,
}
const createToken = (payload: PayloadData) => {
    const secret: string | undefined = process.env.JWT_SECRET;
    if (!secret){
        throw new Error('Invalid secret value');
    }

    return jwt.sign(payload, secret, {expiresIn: '7d'});
}

export default createToken;