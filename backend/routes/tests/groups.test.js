process.env.NODE_ENV = 'test';
const { text } = require('stream/consumers');
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
    await db.query(`DELETE FROM users`)
    await db.query(`ALTER SEQUENCE users_id_seq RESTART WITH 1`);  
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

    const userRes2 = await db.query(
        `INSERT INTO users
        (username, password, first_name, last_name, email)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, username, first_name, last_name, email`,
        [
            "TestUser2",
            "thisisatest123",
            "Victor",
            "Logan",
            "test2@test.com"
        ]
    );

    const userRes3 = await db.query(
        `INSERT INTO users
        (username, password, first_name, last_name, email)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, username, first_name, last_name, email`,
        [
            "TestUser3",
            "thisisatest123",
            "Keanu",
            "Reeves",
            "test3@test.com"
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
    await db.query('DELETE FROM groups'); 
    await db.query(`DELETE FROM users`);
    
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

describe('GET /groups/:id', () => {
    test('Gets a group by its id', async() => {
        const res = await request(app).get('/groups/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.group.id).toBe(1);
        expect(res.body.group.group_owner_id).toBe(1);
        expect(res.body.group.group_game_id).toBe(6954)
    });
    test('Returns error 500 if group ID is invalid', async() => {
        const res = await request(app).get('/groups/0')
        expect(res.statusCode).toBe(500);
    });
});

describe('GET /groups/members/:id before joining group', () => {
    test('Returns no groups joined message', async() => {
        const res = await request(app).get('/groups/members/1')
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('You have not joined any groups')
    });

    // Not implimented 
    // test('Returns 400 if not own user ID', async() => {
    //     const res = await request(app).get('/groups/members/2')
    //     expect(res.statusCode).toBe(400);
    // });
    
});

describe('POST /groups', () => {
    test('Creates a new group and adds user to it as admin', async() => {
        const res = await request(app).post('/groups').send({
            group_name: "BossKillers",
            group_slug: "bosskillers",
            group_game_id: 6954,
            group_owner_id: 2,
            group_discord_url: "https//:discord.gg/server",
            group_logo_url: "https://avatars0.githubusercontent.com/u/13444851?s=460&v=4"
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.newGroup.group.id).toBe(2);
        expect(res.body.newGroup.group.group_name).toBe('BossKillers');
        expect(res.body.newGroup.group.group_game_id).toBe(6954);
        expect(res.body.newGroup.group.group_owner_id).toBe(2);
        expect(res.body.newGroup.member.user_id).toBe(2);
        expect(res.body.newGroup.member.is_group_admin).toBe(true)
    });
    test('Does not create new group if no group name', async() => {
        const res = await request(app).post('/groups').send({
            group_slug: "",
            group_game_id: 6954,
            group_owner_id: 2,
            group_discord_url: "https//:discord.gg/server",
            group_logo_url: "https://avatars0.githubusercontent.com/u/13444851?s=460&v=4"
        });

        expect(res.statusCode).toBe(400)
    })
    test('does not create a group if no game id', async() => {
        const res = await request(app).post('/groups').send({
            group_name: "DoomSlayers",
            group_slug: "doomslayers",
            group_owner_id: 2,
            group_discord_url: "https//:discord.gg/server",
            group_logo_url: "https://avatars0.githubusercontent.com/u/13444851?s=460&v=4"
        });
        expect(res.statusCode).toBe(400)
    })

    test('adds new user to group', async() => {
        const res = await request(app).post('/groups/2/join').send({
            user: 3
        })

        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(2);
        expect(res.body.group_name).toBe('BossKillers')
        expect(res.body.group_game_id).toBe(6954)

    })

    test('does not add user to group if no user_id', async() => {
        const res = await request(app).post('/groups/2/join')

        expect(res.statusCode).not.toBe(200)
        expect(res.statusCode).toBe(400)
    })

});