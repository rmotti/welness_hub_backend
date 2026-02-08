export default (sequelize, Sequelize) => {
  const Usuario = sequelize.define("usuario", {
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
    senha: {
      type: Sequelize.STRING,
      allowNull: false
    },
    telefone: {
      type: Sequelize.STRING
    },
    idade: {
      type: Sequelize.INTEGER
    },
    status: {
      type: Sequelize.ENUM('Ativo', 'Inativo'),
      defaultValue: 'Ativo'
    },
    objetivo: {
      type: Sequelize.ENUM('Ganho de Massa', 'Perda de Peso', 'Manutenção')
    },
    data_criacao: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'USUARIO', // Força o nome exato da tabela no banco
    timestamps: false     // Desativa o createdAt/updatedAt padrão do Sequelize
  });

  return Usuario;
};