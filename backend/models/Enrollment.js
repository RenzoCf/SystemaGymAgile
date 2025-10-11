const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");
const Plan = require("./Plan");

const Enrollment = sequelize.define("Enrollment", {
  startDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

User.belongsToMany(Plan, { through: Enrollment });
Plan.belongsToMany(User, { through: Enrollment });

module.exports = Enrollment;
