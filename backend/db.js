const {Client} = require("pg")
const {DB_URI} = require("./config")

let client = new Client({
    connectionString: DB_URI
});

if(!process.env.NODE_ENV === 'test'){
    client.ssl = {
        rejectUnauthorized: false
    }
}

client.connect();

module.exports = client;