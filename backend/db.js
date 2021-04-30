const {Client} = require("pg")
const {DB_URI} = require("./config")

const client = new Client({
    connectionString: DB_URI,
    ssl:{
        rejectUnauthorized: false
    }
});

client.connect();

module.exports = client;