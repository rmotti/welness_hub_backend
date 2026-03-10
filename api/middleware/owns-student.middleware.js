/**
 * Middleware de isolamento de dados para alunos.
 *
 * Garante que um usuário com role 'student' só consiga acessar rotas onde
 * params.id corresponde ao seu próprio studentId (extraído do JWT).
 *
 * Usuários com role 'trainer' ou 'admin' passam livremente.
 *
 * Requer que verifyToken já tenha populado req.userRole e req.userStudentId.
 */
const ownsStudent = (req, res, next) => {
    const { userRole, userStudentId } = req;

    if (userRole === 'student') {
        if (String(req.params.id) !== String(userStudentId)) {
            return res.status(403).json({
                message: 'Acesso negado. Você só pode acessar seus próprios dados.'
            });
        }
    }

    next();
};

export default ownsStudent;
