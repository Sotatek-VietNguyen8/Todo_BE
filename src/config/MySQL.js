import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('todo', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

export default sequelize;