const db = require('../db');

class Platform {
    static async addPlatform(data) {

        let res = await db.query(`
        INSERT INTO platforms
        (platform_id, abbreviation, alternative_name, platform_name)
        VALUES
        ($1,$2,$3,$4)
        RETURNING *
        `, [data.id, data.abbreviation, data.alternative_name, data.name]);

        return res.rows[0];
    };
};

module.exports = Platform