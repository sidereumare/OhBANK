module.exports = function(sequelize, DataTypes) {
	var Users = sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    account_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10000
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    timestamps: false
  });

  Users.associate = (models) => {
    Users.hasMany(models.qna, {
      foreignKey: 'writer_id',
      sourceKey: 'id',
      allowNull: false,
      onDelete: 'CASCADE'
    });
    Users.hasMany(models.file, {
      foreignKey: 'user_id',
      sourceKey: 'id',
      allowNull: false,
      onDelete: 'CASCADE'
    });
  };
	return Users;
};
