import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    // 1. Pega o header
    const authHeader = req.headers['authorization'];
    
    // 2. Verifica se existe e extrai o token (remove o "Bearer ")
    // O header vem assim: "Bearer eyJhbGciOi..."
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).send({ message: 'Nenhum token fornecido!' });
    }

    // 3. Verifica a assinatura
    jwt.verify(token, process.env.JWT_SECRET || 'SEGREDO_SUPER_SECRETO', (err, decoded) => {
        if (err) {
            console.error("Erro JWT:", err.message); // Bom para debug
            return res.status(401).send({ message: 'Não autorizado! Token inválido ou expirado.' });
        }

        // 4. Injeta ID e ROLE na requisição
        req.userId = decoded.id;
        req.userRole = decoded.role; // <--- ADICIONADO: Importante para proteger rotas depois

        next();
    });
};

export default verifyToken; // Para usar: import verifyToken from '...'