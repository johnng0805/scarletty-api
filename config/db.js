const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize("z32pqxdo95j2cysr", "pujtc31r7wm6ypgc", "l1h2xtqbupdpf4me", {
    host: "dcrhg4kh56j13bnu.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    dialect: 'mysql',
    operatoreAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize.authenticate().then(() => {
    console.log("Database connected.");
}).catch(err => {
    console.error("Unable to connect to database: " + err);
})

module.exports = sequelize;