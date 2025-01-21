import { DataTypes } from 'sequelize';
import sequelize from '../config/MySQL.js'

const Todo = sequelize.define('Todo', {
  textTask: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estimate: {
    type: DataTypes.INTEGER,
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
});

const SubTodo = sequelize.define('SubTodo', {
  textSubTask: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estimateSubTask: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  todoId: {
    type: DataTypes.INTEGER,
    references: {
      model: Todo,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
});

Todo.hasMany(SubTodo, { foreignKey: 'todoId', as: 'subTasks' });
SubTodo.belongsTo(Todo, { foreignKey: 'todoId', as: 'todo' });

export { Todo, SubTodo };
