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
            type: DataTypes.STRING,
            allowNull: false
        },
        write_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        timestamps: false
    });
    return QnA;
};