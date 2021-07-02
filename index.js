import app from './express/app.js';
import sequelize from './sequelize/index.js';
const PORT = 5000;

const assertDatabaseConnectionOk = async () => {
  console.log('Checking database connection...');
  try {
    await sequelize.authenticate();
    console.log('Database connection OK!');
  } catch (error) {
    console.log('Unable to connect to the database:');
    console.log(error.message);
    process.exit(1);
  }
};

const init = async () => {
  await assertDatabaseConnectionOk();

  console.log(`Starting Sequelize + Express MealPlanner on port ${PORT}...`);

  app.listen(PORT, () => {
    console.log(
      `Express server started on port ${PORT}. Try some routes, such as '/days'.`
    );
  });
};

init();
