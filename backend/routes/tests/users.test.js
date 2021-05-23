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

afterAll(async () => {
    delete testUser._token;
    await db.query(`DELETE FROM users`)
    await db.query(`ALTER SEQUENCE users_id_seq RESTART WITH 1`);
    await db.end();
})

describe('POST /users authentication', () => {
    test('Creates a new user', async () => {
        const res = await request(app).post('/users/register').send(testUser);
        if(res.statusCode === 201){
            testUser._token = res.body._token;
        }
        expect(res.statusCode).toBe(201)
        expect(res.body).toHaveProperty('_token')
    });

    test('Logs in a user', async () => {
        const res = await request(app).post('/users/login').send({username: testUser.username, password: testUser.password});
        if(res.statusCode === 201){
            testUser._token = res.body._token;
        };
        expect(res.statusCode).toBe(200);
    });

    test('Returns Unauthorized for invalid password', async () => {
        const res = await request(app).post('/users/login').send({username: testUser.username, password: "thisWontWork"});
        expect(res.statusCode).toBe(401);
    });

    test('Returns Unauthorized for invalid username', async () => {
        const res = await request(app).post('/users/login').send({username: "gibberish", password: testUser.password});

        expect(res.statusCode).toBe(401);
    });
});

describe('GET /users', () => {
    test('Gets a list of users', async () => {
        const res = await request(app).get('/users');
        console.log(res.body)
        expect(res.statusCode).toBe(200)
    });

    test('Gets a single user by ID', async () => {
        const res = await request(app).get('/users/1');
        expect(res.statusCode).toBe(200);
    });

    test('Returns 404 for invalid id', async () => {
        const res = await request(app).get('/users/0');
        expect(res.statusCode).toBe(404);
    });
});

describe('PATCH /users/:id', () => {
    test('Returns Unauthorized for invalid password', async () => {
        const res = await request(app).patch('/users/1').send({
            username: testUser.username,
            password: "nonsense",
            _token: testUser._token
        });
        
        expect(res.statusCode).toBe(401);
    });

    test('Returns Unauthorized if missing _token', async () => {
        const res = await request(app).patch('/users/1').send({
            username: testUser.username,
            password: testUser.password,
            first_name: "Nope"
        });

        expect(res.statusCode).toBe(401);
    });

    test('Returns user data with changes', async () => {
        const res = await request(app).patch('/users/1').send({
            username: testUser.username,
            password: testUser.password,
            _token: testUser._token,
            first_name: "Roger"
        });

        expect(res.body.user.first_name).not.toBe("James");
        expect(res.body.user.first_name).toBe("Roger");
        expect(res.statusCode).toBe(200);
    });

    test('Adds discord URL', async () => {
        const res = await request(app).patch('/users/1').send({
            username: testUser.username,
            password: testUser.password,
            _token: testUser._token,
            discord_url: "https://discord.com/channels/98834784855285760/252220568135270403"
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.user).toHaveProperty('discord_url');
        expect(res.body.user.discord_url).toBe("https://discord.com/channels/98834784855285760/252220568135270403");
    });

    test('Adds profile_img_url', async () => {
        const res = await request(app).patch('/users/1').send({
            username: testUser.username,
            password: testUser.password,
            _token: testUser._token,
            profile_img_url: "https://i.imgur.com/FNxk7B4.jpg"
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.user).toHaveProperty('profile_img_url');
        expect(res.body.user.profile_img_url).toBe("https://i.imgur.com/FNxk7B4.jpg");
    });

    // test('Changes profile_img_url', async => {
    //     const getRes = await request(app).get('/users/1')
    // });
});