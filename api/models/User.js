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
      // Removi 'field: senha' pois no SQL novo a coluna chama 'password' mesmo
    },
    role: {
      type: Sequelize.ENUM('ADMIN', 'ALUNO'), // Maiúsculo conforme SQL
      defaultValue: 'ALUNO'
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
        model: 'USUARIO',
        key: 'id'
      }
    }
  }, {
    tableName: 'USUARIO',
    timestamps: false, // O SQL não criou created_at/updated_at
    underscored: true
  });

  return User;
};