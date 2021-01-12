const db = require("../db");
const bcrypt = require("bcrypt");
const partialUpdate = require("../helpers/partialUpdate");

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
                    email
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
            `SELECT username, first_name, last_name, email
                FROM users
                ORDER BY username`);

        return result.rows;
    };

    static async findOne(username) {
        const userRes = await db.query(
            `SELECT username, first_name, last_name, email, profile_img_url 
                FROM users 
                WHERE username = $1`,
            [username]);
    
        const user = userRes.rows[0];
    
        if (!user) {
          const error = new Error(`There exists no user '${username}'`);
          error.status = 404;
          throw error;
        };

        return user;
    };

    static async update(username, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        let {query, values} = partialUpdate(
            "users",
            data,
            "username",
            username
        );

        const result = await db.query(query, values);
        const user = result.rows[0];

        if (!user) {
            let notFound = new Error(`There exists no user '${username}`);
            notFound.status = 404;
            throw notFound;
        }

        delete user.password;
        delete user.is_admin;

        return result.rows[0];
    };

    static async remove(username) {
        let result = await db.query(
                `DELETE FROM users 
                  WHERE username = $1
                  RETURNING username`,
                [username]);
  
      if (result.rows.length === 0) {
        let notFound = new Error(`There exists no user '${username}'`);
        notFound.status = 404;
        throw notFound;
      };
    };
}

module.exports = User;