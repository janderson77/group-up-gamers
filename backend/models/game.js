const db = require('../db');

class Game {
    static async addGame(data) {        

        let res = await db.query(`
            INSERT INTO games
            (game_name, slug, cover_art, summary, platforms, game_modes)
            VALUES ($1,$2, $3, $4, $5, $6)
            RETURNING id, game_name, platforms, game_modes
        `,[
            data.name, data.slug, data.cover_art || null, data.summary, data.platforms, data.game_modes
        ]);

        return res.rows[0];
    };
};

module.exports = Game;