const db = require("../db");
const bcrypt = require("bcrypt");
const partialUpdate = require("../helpers/partialUpdate");
const toObject = require('../helpers/toObject')

const BCRYPT_WORK_FACTOR = 10;

class User {
    static async authenticate(data) {
        // try to find the user first
        const result = await db.query(
            `SELECT id,
                    username, 
                    password, 
                    first_name, 
                    last_name, 
                    email,
                    profile_img_url,
                    discord_url
              FROM users 
              WHERE username = $1`,
            [data.username]
        );
    
        const user = result.rows[0];
    
        if (user) {
          // compare hashed password to a new hash from password
          const isValid = await bcrypt.compare(data.password, user.password);
          if (isValid) {
            delete user.password;

            const userGroupsRes = await db.query(`
                SELECT *
                FROM group_members
                RIGHT JOIN groups
                ON group_members.group_id = groups.id
                WHERE user_id = $1
            `,[user.id])

            if(userGroupsRes.rows.length > 0){
                let groups = userGroupsRes.rows;
                groups = toObject(groups, "id")

                user.groups = groups;
            };

            const userOwnedGroups = await db.query(`
                SELECT*
                FROM groups
                WHERE group_owner_id = $1
            `,[user.id]);

            if(userOwnedGroups.rows.length > 0){
                let ogroups = userOwnedGroups.rows;
                ogroups = toObject(ogroups, "id")

                user.owned_groups = ogroups;
            };

            const userGamesRes = await db.query(`
                SELECT *
                FROM games_playing
                RIGHT JOIN games
                ON games_playing.game_id = games.id
                WHERE user_id = $1
            `,[user.id]);

            if(userGamesRes.rows.length > 0){
                let games_playing = userGamesRes.rows;
                games_playing = toObject(games_playing, "id")

                user.games_playing = games_playing
            }

            return user;
          }
        }
    
        const invalidPass = new Error("Invalid Credentials");
        invalidPass.status = 401;
        throw invalidPass;
      };

    static async register(data) {
        const duplicateCheck = await db.query(
            `SELECT username 
                FROM users 
                WHERE username = $1`,
            [data.username]
        );

        if (duplicateCheck.rows[0]) {
            const err = new Error(
                `There already exists a user with username '${data.username}`);
            err.status = 409;
            throw err;
        }

        const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users 
                (username, password, first_name, last_name, email) 
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING id, username, first_name, last_name, email`,
            [
                data.username,
                hashedPassword,
                data.first_name,
                data.last_name,
                data.email
            ]);

        return result.rows[0];
    };

    static async findAll() {
        const result = await db.query(
            `SELECT id, username, first_name, last_name, email
                FROM users
                ORDER BY username`);

        return result.rows;
    };

    static async findOne(id) {
        const userRes = await db.query(
            `SELECT id, username, first_name, last_name, email, profile_img_url 
                FROM users 
                WHERE id = $1`,
            [id]);
    
        const user = userRes.rows[0];
    
        if (!user) {
          const error = new Error(`There exists no user with id '${id}'`);
          error.status = 404;
          throw error;
        };

        const userGroupsRes = await db.query(`
                SELECT group_id, user_id, is_group_admin, is_banned, groups.group_name
                FROM group_members
                RIGHT JOIN groups
                ON group_members.group_id = groups.id
                WHERE user_id = $1
            `,[user.id])

            if(userGroupsRes.rows.length > 0){
                user.groups = userGroupsRes.rows;
            };

        const userGamesRes = await db.query(`
            SELECT games_playing.user_id, games_playing.game_id, in_game_name, game_name, slug
            from games_playing
            right join games
            on games_playing.game_id = games.id
            where games_playing.user_id = $1
        `, [user.id]);

        if(userGamesRes.rows.length > 0){
            user.games_playing = userGamesRes.rows
        }

        return user;
    };

    static async update(user_id, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        let {query, values} = partialUpdate(
            "users",
            data,
            "id",
            user_id
        );

        const result = await db.query(query, values);
        const user = result.rows[0];

        if (!user) {
            let notFound = new Error(`There exists no user '${data.username}`);
            notFound.status = 404;
            throw notFound;
        }

        delete user.password;
        delete user.is_admin;

        return result.rows[0];
    };

    static async remove(id) {
        let result = await db.query(
                `DELETE FROM users 
                  WHERE id = $1
                  RETURNING id, username`,
                [id]);
  
      if (result.rows.length === 0) {
        let notFound = new Error(`This user does not exist.`);
        notFound.status = 404;
        throw notFound;
      };
    };
}

module.exports = User;