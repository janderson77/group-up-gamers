const db = require('../db');
const sqlForPartialUpdate = require("../helpers/partialUpdate");

class Game {
    static async findAll(data) {
        let baseQuery = `SELECT game_name, slug, cover_art, summary, platforms, game_modes FROM games`;
        let whereExpressions = [];
        let queryValues = [];

        if (data.search){
            queryValues.push(`%${data.search}%`);
            whereExpressions.push(`slug ILIKE $${queryValues.length}`)
        }

        if(whereExpressions.length > 0){
            baseQuery += " WHERE ";
        }

        let finalQuery = baseQuery + whereExpressions.join(" AND ") + " ORDER BY game_name asc";
        const gamesRes = await db.query(finalQuery, queryValues);
        return gamesRes.rows;
    }

    static async findOne(slug) {
        const gameRes = await db.query(
            `
            SELECT game_name, slug, cover_art, summary, platforms, game_modes 
            FROM games
            WHERE slug = $1
            `,
            [slug]
        );
        
        const game = gameRes.rows[0]

        if(!game) {
            const error = new Error(`We couldn't find a game with name '${slug}'`);
            error.status = 404;
            throw error;
        }

        return game;

    }

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

    static async updateGame(game_name, data) {
        let {query, values} = sqlForPartialUpdate(
            'games', 
            data,
            "game_name",
            game_name
        )
        const res = await db.query(query, values);
        const game = res.rows[0];

        if(!game) {
            let notFound = new Error(`We couldn't find a game with name ${game_name}`);
            notFound.status = 404;
            throw notFound;
        }

        return game;
    }

    static async removeGame(game_name) {
        const res = await db.query(
            `DELETE FROM games
            WHERE game_name = $1
            RETURNING game_name
            `,
            [game_name]
        );

        if(res.rows.length === 0) {
            let notFound = new Error(`We couldn't find a game with name '${game_name}`);
            notFound.status = 404;
            throw notFound;
        }
    }
};



module.exports = Game;