import userService from '../services/user.service.js';


const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email and password are required' });
    }

    try {
        const user = await userService.registerUser({ username, email, password });
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
    }
};

const login = async (req, res) => {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
        return res.status(400).json({ message: 'Username or email and password are required' });
    }

    try {
        const { token } = await userService.loginUser({ username, email, password });
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
    }
};

export default { register, login };
