import MealDays from './mealDays';

const days = (sequelize, DataTypes) => {
  const Days = sequelize.define('days', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Days.associate = (models) => {
    Days.belongsToMany(models.Meals, { through: MealDays });
  };

  return Days;
};

export default days;
