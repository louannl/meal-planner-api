import days from './days';
import meals from './meals';

const MealDays = (sequelize, DataTypes) => {
  const mealDays = sequelize.define('meal_days', {
    meal_id: {
      type: DataTypes.INTEGER,
      references: {
        model: meals,
        key: 'id',
      },
    },
    day_id: {
      type: DataTypes.INTEGER,
      references: {
        model: days,
        key: 'id',
      },
    },
  });

  return mealDays;
};

export default MealDays;
