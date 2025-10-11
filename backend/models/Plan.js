const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Plan = sequelize.define("Plan", {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.TEXT },
  duration: { type: DataTypes.STRING }
});

module.exports = Plan;
