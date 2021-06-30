import meals from './meals';
import tags from './tags';

const MealTags = (sequelize, DataTypes) => {
  const mealTags = sequelize.define('meal_tags', {
    meal_id: {
      type: DataTypes.INTEGER,
      references: {
        model: meals,
        key: 'id',
      },
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: tags,
        key: 'id',
      },
    },
  });

  return mealTags;
};

export default MealTags;
