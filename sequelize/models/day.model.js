import pkg from 'sequelize';
const { DataTypes } = pkg;

export default (sequelize) => {
  sequelize.define(
    'Day',
    {
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    { tableName: 'days' }
  );
};
