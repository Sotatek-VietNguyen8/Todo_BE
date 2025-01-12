import { DataTypes } from 'sequelize'
import sequelize from '../config/MySQL.js'

const Todo = sequelize.define('Todo', {
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
})

export default Todo
