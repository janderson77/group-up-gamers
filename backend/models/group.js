const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate");

class Group {
    static async findAll(data) {
        let baseQuery = `SELECT group_name, group_game_id, group_owner_id, group_discord_url, group_logo_url FROM groups`;
        let whereExpressions = [];
        let queryValues = [];

        if (data.search) {
            queryValues.push(`%${data.search}%`);
            whereExpressions.push(`name ILIKE $${queryValues.length}`);
        };
    
        if (whereExpressions.length > 0) {
            baseQuery += " WHERE ";
        };

        let finalQuery = baseQuery + whereExpressions.join(" AND ") + " ORDER BY group_name";
        const groupsRes = await db.query(finalQuery, queryValues);
        return groupsRes.rows;
    };

    static async findOneByName(group_name) {
        const groupRes = await db.query(
            `SELECT group_name, group_game_id, group_owner_id, group_discord_url, group_logo_url
                FROM groups
                WHERE group_name ILIKE = $1`,
            [group_name]);
    
        const group = groupRes.rows[0];
    
        if (!group) {
          const error = new Error(`There exists no group '${group_name}'`);
          error.status = 404;   // 404 NOT FOUND
          throw error;
        }
    
        return group;
    };

    static async findOneById(id) {
        const groupRes = await db.query(
            `SELECT group_name, group_game_id, group_owner_id, group_discord_url, group_logo_url
                FROM groups
                WHERE id = $1`,
            [id]);
    
        const group = groupRes.rows[0];
    
        if (!group) {
          const error = new Error(`There exists no group '${handle}'`);
          error.status = 404;   // 404 NOT FOUND
          throw error;
        };
    
        return group;
    };

    static async create(data) {
        const duplicateCheck = await db.query(
            `SELECT group_name 
                FROM groups 
                WHERE group_name = $1`,
            [data.group_name]);
    
        if (duplicateCheck.rows[0]) {
          let duplicateError = new Error(
              `There already exists a group with name '${data.group_name}`);
          duplicateError.status = 409; // 409 Conflict
          throw duplicateError
        }
    
        const result = await db.query(
            `INSERT INTO groups 
                  (group_name, group_game_id, group_owner_id, group_discord_url, group_logo_url)
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING id, group_name, group_game_id, group_owner_id, group_discord_url, group_logo_url`,
            [
              data.handle,
              data.name,
              data.num_employees,
              data.description,
              data.logo_url
            ]);
    
        return result.rows[0];
      };

    static async update(id, data) {
        let {query, values} = sqlForPartialUpdate(
            "groups",
            data,
            "id",
            id
        );
    
        const result = await db.query(query, values);
        const group = result.rows[0];
    
        if (!group) {
          let notFound = new Error(`There exists no group with id '${id}`);
          notFound.status = 404;
          throw notFound;
        }
    
        return group;
      };

    static async remove(id) {
        const result = await db.query(
            `DELETE FROM groups 
              WHERE id = $1 
              RETURNING id`,
            [id]);
    
        if (result.rows.length === 0) {
          let notFound = new Error(`There exists no group with id '${id}`);
          notFound.status = 404;
          throw notFound;
        };
    };
    
};

module.exports = Company;