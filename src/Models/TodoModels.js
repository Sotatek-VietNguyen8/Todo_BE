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

  const User = sequelize.define('Users', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    userName: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            len: [3,10]
        }
    },
    userId: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        primaryKey: true
    },
    password: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    lastlogin: {
        type: Date,
        default: Date.now
    }
  },
  {
    tableName:'users',
    timestamps: true
  });

  export { Todo, SubTodo, User};