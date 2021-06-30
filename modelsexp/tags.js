import MealTags from './mealTags';

const tags = (sequelize, DataTypes) => {
  const Tags = sequelize.define('tags', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Tags.associate = (models) => {
    Tags.belongsToMany(models.Meals, { through: MealTags });
  };

  return Tags;
};

export default tags;
