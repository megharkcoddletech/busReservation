const mysql = require("mysql2");
const util = require('util');
const promise = require("mysql-promise");

const con = {
    host: "localhost",
    user: "root",
    password: "S006ya#1",
    database: "megha"
};

function makeDb(config) {

    const connection = mysql.createConnection(con);
    return {
        query(sql, args) {
            return util.promisify(connection.query).call(connection, sql, args);
        },
        close() {
            return util.promisify(connection.end).call(connection);
        }
    };
}

module.exports = { makeDb };
