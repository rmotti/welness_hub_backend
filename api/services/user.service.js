import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/User.js';
import userService from '../services/user.service.js';

const registerUser = async ({ username, email, password }) => {
    // Verifica se já existe um usuário com o email informado
    const existingUser = await db.findOne({ where: { email } });
    if (existingUser) {
        throw { status: 409, message: 'Email already in use' };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.create({
        username,
        email,
        password: hashedPassword
    });

    return newUser;
};

const loginUser = async ({ username, email, password }) => {
    const whereCondition = username ? { username } : { email };
    const user = await db.findOne({ 
        where: whereCondition,
        attributes: ['id', 'username', 'email', 'password'] // Inclui password explicitamente
    });

    if (!user) {
        throw { status: 404, message: 'User not found' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw { status: 401, message: 'Invalid credentials' };
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    // Remove a senha antes de retornar
    const userWithoutPassword = { id: user.id, username: user.username, email: user.email };
    
    return { user: userWithoutPassword, token };
};

export default {
    registerUser,
    loginUser
};