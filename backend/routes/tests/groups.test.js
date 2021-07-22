process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../../app');
const db = require('../../db');

let testUser = {
    username: "TestUser",
    password: "Testpassword1!",
    email: "test@test.com",
    first_name: "James",
    last_name: "Logan"
};

beforeAll(async() => {
    
    const userRes = await db.query(
        `INSERT INTO users
        (username, password, first_name, last_name, email)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, username, first_name, last_name, email`,
        [
            "Doom_Guy",
            "Doomdoomdoom",
            "Doom",
            "Guy",
            "Doomguy@doom.com"
        ]
    );
    const groupRes = await db.query(
        `INSERT INTO groups
        (group_name, group_slug, group_game_id, group_owner_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, group_name, group_game_id, group_owner_id, group_discord_url, group_logo_url`,
        [
            "Doomers",
            "doomers",
            6954,
            1
        ]
        );
    const res = await request(app).post('/users/register').send(testUser);
    if(res.statusCode === 201){
        testUser._token = res.body._token;
    };
});

afterAll(async () => {
    delete testUser._token;
    await db.query(`DELETE FROM users`);
    await db.query('DELETE FROM GROUPS');
    await db.query(`ALTER SEQUENCE users_id_seq RESTART WITH 1`);
    await db.query('ALTER SEQUENCE groups_id_seq RESTART WITH 1');
    await db.end();
});

describe('GET /groups', () => {
    test('Gets a list of all groups', async () => {
        const res = await request(app).get('/groups');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].id).toBe(1);
        expect(res.body[0].group_owner_id).toBe(1);

    });
});