const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const checkIfJoinedOrBanned = require('../helpers/checkIfJoinedOrBanned');
const toObject = require('../helpers/toObject')

class Group {
  static async findAll(data) {
      let baseQuery = `SELECT groups.id, group_name, group_slug, group_game_id, group_owner_id, group_discord_url, group_logo_url, game_name, games.slug as game_slug 
      FROM groups
      RIGHT JOIN games
      ON games.id = groups.group_game_id
      WHERE groups.group_name IS NOT null
      `;
      
      let whereExpressions = [];
      let queryValues = [];

      if (data.search) {
          queryValues.push(`%${data.search}%`);
          whereExpressions.push(`group_slug ILIKE $${queryValues.length}`);
      };
  
      if (whereExpressions.length > 0) {
          baseQuery += " WHERE ";
      };

      let finalQuery = baseQuery + whereExpressions.join(" AND ") + " ORDER BY group_name";
      const groupsRes = await db.query(finalQuery, queryValues);
      return groupsRes.rows;
  };

  static async findOneById(id) {
      const groupRes = await db.query(
          `SELECT groups.id, group_name, group_game_id, group_owner_id, group_discord_url, group_logo_url, game_name, games.id as game_id, slug as game_slug
          FROM groups
          RIGHT JOIN games
          ON groups.group_game_id = games.id
          WHERE groups.id = $1`,
          [id]);
  
      let group = groupRes.rows[0];
  
      if (!group) {
        const error = new Error(`There exists no group '${handle}'`);
        error.status = 404;   // 404 NOT FOUND
        throw error;
      };

      let groupGameId = group.game_id

      const membersRes = await db.query(`
      SELECT group_id, group_members.user_id, is_group_admin, is_banned, username, users.id, games_playing.in_game_name
      FROM group_members
      RIGHT JOIN users
      ON group_members.user_id = users.id
      RIGHT JOIN games_playing
      ON group_members.user_id = games_playing.user_id
      WHERE group_id = $1 AND games_playing.game_id = $2
        `, [id, groupGameId]);

      group.members = membersRes.rows;

      const messagesRes = await db.query(`
        SELECT message_id, message_user_id, message_group_id, message_body, posted_at, users.username as message_username
        FROM group_messages
        RIGHT JOIN users
        ON group_messages.message_user_id = users.id
        WHERE message_group_id = $1
        ORDER BY message_id desc
      `,[id]);

      group.messages = messagesRes.rows || [];
  
      return group;
  };

  static async findAllOfOwn(user_id){
    const groupRes = await db.query(`
        SELECT *
        FROM group_members
        RIGHT JOIN groups
        ON group_members.group_id = groups.id
        WHERE user_id = $1
    `,[user_id])

    let groups
    if(groupRes.rows.length > 0){
        groups = groupRes.rows;
        groups = toObject(groups, "id")

        // user.groups = groups;
    }else{
      groups.message = "You have not joined any groups"
    };
    return groups;

    
  }

  static async joinGroup(user, group_id){

    const joinedOrBanned = await checkIfJoinedOrBanned(user, group_id);

    if(joinedOrBanned.joined){
      if(joinedOrBanned.is_banned){
        let joinError = new Error(`You cannot join this group. You have been banned.`);
        joinError.status = 400
        throw joinError
      }
      let joinError = new Error(`You are already in this group`);
      joinError.status = 400
      throw joinError
    }

    const joinRes = await db.query(`
      INSERT INTO group_members
      (group_id, user_id)
      VALUES
      ($1, $2)
      RETURNING group_id, user_id
    `, [group_id, user])

    if(joinRes.rows === 0){
      let joinError = new Error(`ERROR! Something went wrong!`);
      joinError.status = 500;
      throw error;
    }

    let groupRes = await db.query(`
      SELECT groups.id, group_name, group_game_id, group_slug
      FROM groups
      WHERE groups.id = $1
    `,[group_id]);

    return(groupRes.rows[0].data);
  };

  static async banUser(user_id, group_id) {
    const joinedOrBanned = await checkIfJoinedOrBanned(user_id, group_id);

    if(!joinedOrBanned.joined){
      let error = new Error("This user is not in this group.")
      error.status = 400;
      throw error;
    }

    if(joinedOrBanned.is_banned){
      let error = new Error("This user is already banned.")
      error.status = 400;
      throw error;
    }

    const banRes = await db.query(`
      UPDATE group_members
      SET is_banned = true
      WHERE user_id = $1
      AND group_id = $2
      RETURNING user_id, group_id
    `, [user_id, group_id]);

    if(banRes.rows.length === 0){
      let error = new Error("ERROR! Something went wrong. Please try again.")
      error.status = 500;
      throw error;
    };

    const bannedUser = await db.query(`
      SELECT group_id, user_id, is_group_admin, is_banned, username
      FROM group_members
      RIGHT JOIN users
      ON group_members.user_id = users.id
      WHERE user_id = $1
      AND group_id = $2
    `, [user_id, group_id])

    return bannedUser.rows[0]
  };

  static async unbanUser(user_id, group_id) {
    const joinedOrBanned = await checkIfJoinedOrBanned(user_id, group_id);

    if(!joinedOrBanned.joined){
      let error = new Error("This user is not in this group.")
      error.status = 400;
      throw error;
    }

    if(!joinedOrBanned.is_banned){
      let error = new Error("This user is not banned.")
      error.status = 400;
      throw error;
    }

    const unbanRes = await db.query(`
      UPDATE group_members
      SET is_banned = false
      WHERE user_id = $1
      AND group_id = $2
      RETURNING user_id, group_id
    `, [user_id, group_id]);

    if(unbanRes.rows.length === 0){
      let error = new Error("ERROR! Something went wrong. Please try again.")
      error.status = 500;
      throw error;
    };

    const unBannedUser = await db.query(`
      SELECT group_id, user_id, is_group_admin, is_banned, username
      FROM group_members
      RIGHT JOIN users
      ON group_members.user_id = users.id
      WHERE user_id = $1
      AND group_id = $2
    `, [user_id, group_id])

    return unBannedUser.rows[0]
  };

  static async kickUser(user, group){
    const kickRes = await db.query(`
    DELETE FROM group_members
    WHERE user_id = $1
    AND group_id = $2
    RETURNING user_id
    `, [user, group]);

    if(kickRes.rows.length === 0){
      let error = new Error(`ERROR: This user is not in this group`)
      error.status = 404;
      throw error;
    };

    return kickRes.rows[0]
  }

  static async leaveGroup(user, group){
    const checkIfJoined = await checkIfJoinedOrBanned(user, group);

    if(!checkIfJoined.joined || checkIfJoined.is_banned){
      let error = new Error("You are not in this group.")
      error.status = 400;
      throw error;
    }

    const leaveRes = await db.query(`
      DELETE FROM group_members
      WHERE user_id = $1
      AND group_id = $2
      RETURNING group_id, user_id
    `, [user, group])

    if(leaveRes.rows.length === 0){
      let error = new Error(`ERROR! Something went wrong!`);
      error.status = 500;
      throw error;
    }

    return(leaveRes.rows[0]);
  };

  static async create(data) {
      const duplicateCheck = await db.query(
          `SELECT group_slug 
              FROM groups 
              WHERE group_slug = $1`,
          [data.group_slug]);
  
      if (duplicateCheck.rows[0]) {
        let duplicateError = new Error(
            `There already exists a group with name '${data.group_name}`);
        duplicateError.status = 409; // 409 Conflict
        throw duplicateError
      }
  
      const result = await db.query(
          `INSERT INTO groups 
                (group_name, group_slug, group_game_id, group_owner_id, group_discord_url, group_logo_url)
              VALUES ($1, $2, $3, $4, $5, $6) 
              RETURNING id, group_name, group_game_id, group_owner_id, group_discord_url, group_logo_url`,
          [
            data.group_name,
            data.group_slug,
            data.group_game_id,
            data.group_owner_id,
            data.group_discord_url,
            data.group_logo_url
          ]);
      
      const membersRes = await db.query(`
          INSERT INTO group_members
          (group_id, user_id, is_group_admin)
          VALUES ($1,$2,$3)
          RETURNING *
      `,[result.rows[0].id, data.group_owner_id, true])

      const checkIfInGamesPlaying = await db.query(`
          SELECT *
          FROM games_playing
          WHERE user_id = $1 AND game_id = $2
      `,[data.group_owner_id, data.group_game_id]);

      if(checkIfInGamesPlaying.rows.length === 0){
        db.query(`
        INSERT INTO games_playing
        (user_id, game_id, in_game_name)
        VALUES
        ($1,$2,$3)
        `, [data.group_owner_id, data.group_game_id, data.in_game_name || undefined])
      }

      const returnVal = {
        group: result.rows[0],
        member: membersRes.rows[0]
      }
  
      return returnVal;
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

module.exports = Group;