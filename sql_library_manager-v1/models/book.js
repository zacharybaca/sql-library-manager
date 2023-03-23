"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Book.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Please provide a value for "title"',
          },
          notNull: {
            msg: 'Please provide a value for "Title"',
          },
        },
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Please provide a value for "author"',
          },
          notNull: {
            msg: 'Please provide a value for "Author"',
          },
        },
      },
      genre: {
        type: DataTypes.STRING,
      },
      year: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Book",
    }
  );
  return Book;
};
