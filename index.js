/* eslint-disable no-console */
import app from './src/app.js';

const PORT = process.env.PORT || 5000;

const init = async () => {
  app.listen(PORT, () => {
    console.log(
      `Express server started on port ${PORT}. Try some routes, such as '/days'.`,
    );
  });
};

init();
