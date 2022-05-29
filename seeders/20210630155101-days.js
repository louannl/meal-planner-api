'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'days',
      [
        {
          id: 1,
          name: 'Monday',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: 'Tuesday',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          name: 'Wednesday',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 4,
          name: 'Thursday',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 5,
          name: 'Friday',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 6,
          name: 'Saturday',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 7,
          name: 'Sunday',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },
  //Since we are not using sequelize to inset the seed data,
  //we need to insert the createAt items

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('days', null, {});
  },
};
