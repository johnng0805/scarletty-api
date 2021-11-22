const dotenv = require("dotenv");
dotenv.config();

const fs = require("fs");

module.exports = {
    "development": {
        "username": "pujtc31r7wm6ypgc",
        "password": "l1h2xtqbupdpf4me",
        "database": "z32pqxdo95j2cysr",
        "host": "dcrhg4kh56j13bnu.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        "dialect": "mysql"
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "production": {
        "use_env_variable": "DATABASE_URL"
    }
};