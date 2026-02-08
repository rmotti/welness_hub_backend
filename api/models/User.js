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
    password: { // No JS chamamos de 'password'
      type: Sequelize.STRING,
      allowNull: false,
      field: 'senha' // No Banco a coluna chama 'senha'
    },
    role: {
      type: Sequelize.ENUM('admin', 'aluno'),
      defaultValue: 'aluno'
    },
    status: {
      type: Sequelize.ENUM('Ativo', 'Inativo'),
      defaultValue: 'Ativo'
    },
    objetivo: { type: Sequelize.STRING },
    telefone: { type: Sequelize.STRING },
    idade: { type: Sequelize.INTEGER },
    
    // O PULO DO GATO (Hierarquia)
    personal_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'USUARIO', // Nome exato da tabela no banco
        key: 'id'
      }
    }
  }, {
    tableName: 'USUARIO', // Nome exato da tabela
    timestamps: true,     // O script SQL tem created_at/updated_at
    underscored: true     // Converte camelCase para snake_case (createdAt -> created_at)
  });

  return User;
};