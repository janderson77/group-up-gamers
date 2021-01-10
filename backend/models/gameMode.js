const db = require('../db');

class GameMode {
    static async addGame(data) {        

        let res = await db.query(`
            INSERT INTO game_modes
            (mode_id, mode_name, mode_slug)
            VALUES ($1,$2, $3)
            RETURNING *
        `,[
            data.id, data.name, data.slug
        ]);

        return res.rows[0];
    };
};

module.exports = GameMode;