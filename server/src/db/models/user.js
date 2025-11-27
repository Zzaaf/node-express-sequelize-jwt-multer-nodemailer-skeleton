const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // Ассоциации моделей
    static associate(models) {
      this.hasMany(models.Task, {
        foreignKey: 'user_id',
      })
    }

    // Валидация почты
    static validateEmail(email) {
      const emailPattern = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}$/;
      return emailPattern.test(email);
    }

    // Валидация пароля
    static validatePassword(password) {
      const hasUpperCase = /[A-Z]/;
      const hasLowerCase = /[a-z]/;
      const hasNumbers = /\d/;
      const hasSpecialCharacters = /[!@#$%^&*()-,.?":{}|<>]/;
      const isValidLength = password.length >= 8;

      if (
        !hasUpperCase.test(password) ||
        !hasLowerCase.test(password) ||
        !hasNumbers.test(password) ||
        !hasSpecialCharacters.test(password) ||
        !isValidLength
      ) {
        return false;
      }

      return true;
    }

    // Валидация данных при авторизации
    static validateSignInData({ email, password }) {
      if (!email || typeof email !== 'string' || email.trim().length === 0) {
        return {
          isValid: false,
          error: 'Email should not be empty',
        };
      }

      if (
        !password ||
        typeof password !== 'string' ||
        password.trim().length === 0
      ) {
        return {
          isValid: false,
          error: 'Password should not be empty',
        };
      }

      return {
        isValid: true,
        error: null,
      };
    }

    // Валидация данных при регистрации
    static validateSignUpData({ name, email, password }) {
      if (
        !name ||
        typeof name !== 'string' ||
        name.trim().length === 0
      ) {
        return {
          isValid: false,
          error: 'Username field should not be empty',
        };
      }

      if (
        !email ||
        typeof email !== 'string' ||
        email.trim().length === 0 ||
        !this.validateEmail(email)
      ) {
        return {
          isValid: false,
          error: 'Email must be valid',
        };
      }

      if (
        !password ||
        typeof password !== 'string' ||
        password.trim().length === 0 ||
        !this.validatePassword(password)
      ) {
        return {
          isValid: false,
          error:
            'Password should not be empty, must contain one uppercase letter, one lowercase letter, one special character, and be at least 8 characters long',
        };
      }

      return {
        isValid: true,
        error: null,
      };
    }
  }

  User.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    avatar: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null
    },
    isActivated: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    activationToken: {
      allowNull: true,
      type: DataTypes.STRING,
      unique: true,
      defaultValue: null
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    }
  }, {
    sequelize,
    hooks: {
      // Before creating user
      beforeCreate: async (newUser) => {
        // Hash password
        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        newUser.password = hashedPassword;
        // Convert email and username to lowercase
        newUser.email = newUser.email.trim().toLowerCase();
        newUser.name = newUser.name.trim();
      },
      // After creating user
      afterCreate: (newUser) => {
        const rawUser = newUser.get();
        delete rawUser.password;
        return rawUser;
      },
    },
    modelName: 'User',
  });
  return User;
};