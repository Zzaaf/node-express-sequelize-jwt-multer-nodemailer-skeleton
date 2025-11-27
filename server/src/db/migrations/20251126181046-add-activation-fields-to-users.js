module.exports = {
  async up (queryInterface, Sequelize) {
    // Добавляем поле isActivated (статус активации аккаунта)
    await queryInterface.addColumn('Users', 'isActivated', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    // Добавляем поле activationToken (токен для активации)
    await queryInterface.addColumn('Users', 'activationToken', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      defaultValue: null
    });
  },

  async down (queryInterface, Sequelize) {
    // Удаляем добавленные поля
    await queryInterface.removeColumn('Users', 'isActivated');
    await queryInterface.removeColumn('Users', 'activationToken');
  }
};
