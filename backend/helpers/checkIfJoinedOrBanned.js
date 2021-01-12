const db = require("../db");

const checkIfJoinedOrBanned = async function(user_id, group_id){
    
    const check = await db.query(`
        SELECT user_id, is_banned
        FROM group_members
        WHERE user_id = $1
        AND group_id = $2
      `, [user_id, group_id]);
    
    let result = {
        joined: false,
        is_banned: false
    }

    if(check.rows.length !== 0){
        if(check.rows[0].is_banned){
            result.is_banned = true;
        }
        
        result.joined = true;
    }
    
    return result;
};

module.exports = checkIfJoinedOrBanned;