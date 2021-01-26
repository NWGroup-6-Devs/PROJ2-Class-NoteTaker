// const Sequelize = require("sequelize");
// const db = require("../config/database");
// const Note = db.define
module.exports = function(sequelize, DataTypes) {
  const Note = sequelize.define("Note", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1],
    },
    contact_email: {
      type: DataTypes.STRING,
    },
  });

  Note.associate = function(models) {
    Note.belongsTo(models.User, {
      foreignKey: {
        allowNull: true,
      },
    });
  };

  return Note;
};
