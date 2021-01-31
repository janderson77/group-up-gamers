const db = require('../db');

class Message {
    static async getMessages(group_id){
        const res = await db.query(`
        SELECT *
        FROM group_messages
        WHERE message_group_id = $1
        `,[group_id]);

        if(res.rows.length === 0){
            let error = new Error("No messages.");
            error.status = 404;
            throw error;
        };

        return res.rows;
    }

    static async getMessageById(message_id){
        const res = await db.query(`
        SELECT *
        FROM group_messages
        WHERE message_id = $1
        `,[message_id]);

        if(res.rows.length === 0){
            let error = new Error("No message found.");
            error.status = 404;
            throw error;
        };

        return res.rows[0];
    }

    static async createMessage(data){
        const res = await db.query(`
        INSERT INTO group_messages
        (message_user_id, message_group_id, message_body)
        VALUES ($1,$2,$3)
        RETURNING *
        `, [data.message_user_id, data.message_group_id, data.message_body]);

        if(!res.rows[0]){
            let error = new Error("ERROR! Please try again.");
            error.status = 500;
            throw error;
        };

        return res.rows[0];
    };

    static async deleteMessage(message_id){
        const res = await db.query(`
        DELETE FROM group_messages
        WHERE message_id = $1
        RETURNING message_id
        `,[message_id]);

        if(!res.rows[0]){
            let error = new Error(`There is no message with id ${message_id}`);
            error.status = 404;
            throw error;
        };

        return res.rows[0];
    }
};

module.exports = Message;