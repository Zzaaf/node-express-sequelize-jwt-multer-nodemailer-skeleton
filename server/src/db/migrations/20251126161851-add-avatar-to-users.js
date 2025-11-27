module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'avatar', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'avatar');
  }
};
