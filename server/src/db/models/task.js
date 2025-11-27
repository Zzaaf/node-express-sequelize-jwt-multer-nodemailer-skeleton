const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      // было hasMany => падали в ошибку
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
      })
    }
  }
  Task.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.BOOLEAN
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: { tableName: 'Users' },
        key: 'id'
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};