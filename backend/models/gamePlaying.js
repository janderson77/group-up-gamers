const db = require('../db');

class GamePlaying {
    static async getAllGamesPlaying(user_id){
        const res = await db.query(`
        SELECT * 
        FROM games_playing
        RIGHT JOIN games
        ON games.id = game_id
        WHERE user_id = $1
        `, [user_id])

        if((res).rows.length === 0){
            return{
                status: 404,
                message: "You have not added any games."
            }
        }

        return res.rows;
    }

    static async getOneGamePlayingById(data, user_id){
        const res = db.query(`
        SELECT *
        FROM games_playing
        WHERE user_id = $1
        AND game_id = $2
        `, [user_id, data.game_id]);

        if((await res).rows.length === 0){
            let error = new Error("This game is not on your list.");
            error.status = 404;
            throw error;
        }

        return res.rows;
    }

    static async addGamePlaying(data, user_id) {
        const duplicateCheck = await db.query(`
        SELECT * 
        FROM games_playing
        WHERE user_id = $1
        AND game_id = $2
        `, [user_id, data.game_id]);

        if(duplicateCheck.rows.length !== 0){
            let error = new Error('You already have this game added.');
            error.status = 400;
            throw error;
        }

        let res = await db.query(`
        INSERT INTO games_playing
        (user_id, game_id, in_game_name)
        VALUES
        ($1,$2,$3)
        RETURNING  user_id, game_id, in_game_name
        `,[user_id, data.game_id, data.in_game_name]);

        let gameRes = await db.query(`
        SELECT *
        FROM games
        WHERE id = $1
        `, [data.game_id])

        return gameRes.rows
    };

    static async updateGamePlaying(data, user_id){
        const query = db.query(`
        UPDATE games_playing
        SET in_game_name = $1
        WHERE user_id = $2
        AND game_id = $3
        RETURNING *
        `, [data.in_game_name, user_id, data.game_id])

        const res = query.rows[0]

        if(!res){
            let error = new Error(`ERROR! Please check your data`);
            error.status = 404;
            throw error;
        };

        return res;
    };

    static async removeGamePlaying(data, user_id){
        const res = await db.query(`
        DELETE FROM games_playing
        WHERE game_id = $1
        AND user_id = $2
        RETURNING game_id
        `, [data.game_id, user_id]);

        if(res.rows.length === 0) {
            let notFound = new Error(`Could not find game with id '${data.game_id} in your list`);
            notFound.status = 404;
            throw notFound;
        };

        return res.rows[0];
    }
}

module.exports = GamePlaying;