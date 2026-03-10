export default (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    // TODO: Migração necessária no banco:
    //   ALTER TYPE "enum_usuario_role" ADD VALUE 'admin';
    //   ALTER TYPE "enum_usuario_role" ADD VALUE 'trainer';
    //   ALTER TYPE "enum_usuario_role" ADD VALUE 'student';
    //   UPDATE usuario SET role = 'trainer' WHERE role = 'ADMIN';
    //   UPDATE usuario SET role = 'student' WHERE role = 'ALUNO';
    role: {
      type: Sequelize.ENUM('admin', 'trainer', 'student', 'ADMIN', 'ALUNO'), // Inclui valores legados para retrocompatibilidade
      defaultValue: 'trainer'
    },
    status: {
      type: Sequelize.ENUM('Ativo', 'Inativo'),
      defaultValue: 'Ativo'
    },
    objetivo: { type: Sequelize.STRING },
    telefone: { type: Sequelize.STRING },

    // Auto-relacionamento (Personal)
    personal_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'usuario',
        key: 'id'
      }
    },

    // Fase 1 — RBAC: vincula um usuário com role 'student' ao seu registro de aluno.
    // Para usuários student, student_id = seu próprio id em usuario.
    // Para trainers e admins, student_id = null.
    // TODO: quando uma tabela Students separada existir, ajustar a FK.
    student_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'usuario',
    timestamps: false,
    underscored: true
  });

  return User;
};