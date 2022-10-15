const users = require("./users");

module.exports = function(sequelize, DataTypes) {
    var QnA = sequelize.define("qna", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        writer_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        write_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        timestamps: false
    });
    QnA.associate = (models) => {
        QnA.belongsTo(models.users, {
            foreignKey: 'writer_id',
        });
        QnA.hasMany(models.file, {
            foreignKey: 'qna_id',
            sourceKey: 'id',
            allowNull: false,
            onDelete: 'CASCADE'
        });
    };
    return QnA;
};