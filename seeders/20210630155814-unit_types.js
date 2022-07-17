module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'unit_types',
      [
        {
          id: 1,
          name: 'grams',
          symbol: 'g',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: 'millilitres',
          symbol: 'ml',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          name: 'amount',
          symbol: 'Amo.',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 4,
          name: 'tablespoon',
          symbol: 'tbsp',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 5,
          name: 'teaspoon',
          symbol: 'tsp',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => queryInterface.bulkDelete('unit_types', null, {}),
};
