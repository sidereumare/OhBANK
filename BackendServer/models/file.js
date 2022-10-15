const users = require("./users");

module.exports = function(sequelize, DataTypes) {
    var File = sequelize.define("file", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        file_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        saved_name: {
            type: DataTypes.STRING,
            allowNull: false
        },    
        qna_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    });
    File.associate = (models) => {
        File.belongsTo(models.users, {
            foreignKey: 'user_id',
        });
        File.belongsTo(models.qna, {
            foreignKey: 'qna_id',
            allowNull: true,
        });
    };
    return File;
}