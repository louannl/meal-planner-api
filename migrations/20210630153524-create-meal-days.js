module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('meal_days', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      meal_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'meals',
          key: 'id',
        },
      },
      day_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'days',
          key: 'id',
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('meal_days');
  },
};
