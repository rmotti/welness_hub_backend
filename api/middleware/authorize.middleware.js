/**
 * Middleware de autorização baseada em roles (RBAC).
 *
 * Uso: authorize('trainer', 'admin')
 * Requer que o middleware verifyToken já tenha populado req.userRole.
 *
 * @param {...string} roles - Roles permitidos para acessar a rota.
 */
const authorize = (...roles) => (req, res, next) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
        return res.status(403).json({
            message: `Acesso negado. Permissão insuficiente. Roles permitidos: [${roles.join(', ')}].`
        });
    }
    next();
};

export default authorize;
