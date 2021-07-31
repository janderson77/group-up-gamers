process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../../app');
const db = require('../../db');


afterAll(async () => {
    await db.query(`ALTER SEQUENCE users_id_seq RESTART WITH 1`);
    await db.end();
});

let testUser = {
    username: "TestUser",
    password: "Testpassword1!",
    email: "test@test.com",
    first_name: "James",
    last_name: "Logan"
};

describe('POST /users authentication', () => {
    test('Creates a new user', async () => {
        const res = await request(app).post('/users/register').send(testUser);
        if(res.statusCode === 201){
            testUser._token = res.body._token;
        }else{
            console.log(res.body)
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
        expect(res.statusCode).toBe(200)
        expect(res.body.users.length).not.toBe(0);
        expect(res.body.users[0]).toHaveProperty("id");
        expect(res.body.users[0]).not.toHaveProperty("_token");
        expect(res.body.users[0]).not.toHaveProperty("password");
    });

    test('Gets a single user by ID', async () => {
        const res = await request(app).get('/users/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user).not.toHaveProperty("_token");
        expect(res.body.user).not.toHaveProperty("password");

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

    test('Returns Unauthorized if invalid _token', async () => {
        const res = await request(app).patch('/users/1').send({
            username: testUser.username,
            password: testUser.password,
            first_name: "Nope",
            _token: "hellothere.generalkenobi"
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

    test('Changes profile_img_url', async () => {
        const getRes = await request(app).get('/users/1')
        const patchRes = await request(app).patch('/users/1').send({
            username: testUser.username,
            password: testUser.password,
            _token: testUser._token,
            profile_img_url: "https://static.wikia.nocookie.net/deadliestfiction/images/7/73/Doomslayer.png/revision/latest?cb=20200325231240"
        });

        expect(getRes.body.user.profile_img_url).toBe("https://i.imgur.com/FNxk7B4.jpg");

        expect(patchRes.body.user.profile_img_url).not.toBe(getRes.body.user.profile_img_url);

        expect(patchRes.body.user.profile_img_url).toBe("https://static.wikia.nocookie.net/deadliestfiction/images/7/73/Doomslayer.png/revision/latest?cb=20200325231240");


    });

    test('Changes discord_url', async () => {
        const getRes = await request(app).get('/users/1');
        const patchRes = await request(app).patch('/users/1').send({
            username: testUser.username,
            password: testUser.password,
            _token: testUser._token,
            discord_url: "https://discord.com/channels/257360451665395721/257360451665395721"
        });

        expect(getRes.body.user.discord_url).toBe("https://discord.com/channels/98834784855285760/252220568135270403");

        expect(patchRes.body.user.discord_url).not.toBe(getRes.body.user.discord_url);

        expect(patchRes.body.user.discord_url).toBe("https://discord.com/channels/257360451665395721/257360451665395721")
    });
});

describe('POST /users/:id/games_playing', () => {
    test('Adds game to user games playing list', async () => {
        const res = await request(app).post('/users/1/games_playing').send({
            user_id: 1,
            game_id: 17725,
            in_game_name: "Doomslayer"
        });

        expect(res.statusCode).toBe(200);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0].id).toBe(17725);
        expect(res.body[0].game_name).toBe("DOOM");
    });

    test('Adds game to user games playing list with no in game name', async () => {
        const res = await request(app).post('/users/1/games_playing').send({
            user_id: 1,
            game_id: 6954
        });

        expect(res.statusCode).toBe(200);
    });

    test('Returns 400 if no game id', async () => {
        const res = await request(app).post('/users/1/games_playing').send({
            user_id: 1,
            in_game_name: "Doomslayer"
        });

        expect(res.statusCode).toBe(400);
    });

    test('Returns 400 if no user id', async () => {
        const res = await request(app).post('/users/1/games_playing').send({
            game_id: 17725,
            in_game_name: "Doomslayer"
        });

        expect(res.statusCode).toBe(400);
    })
});

describe('GET /users/:id/games_playing', () => {
    test('Gets a list of games the user is playing', async() => {
        const res = await request(app).get('/users/1/games_playing');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).not.toBe(0);
        expect(res.body[0]).toHaveProperty('user_id');
        expect(res.body[0].user_id).toBe(1);
        expect(res.body[0].game_id).toBe(17725)
    });

    
});

describe('DELETE users/:id/games_playing/:game_id', () => {
    test('Returns 401 if no _token', async () => {
        const res = await request(app).delete('/users/1/games_playing/17725')

        expect(res.statusCode).toBe(401);
    });

    test('Returns 401 if invalid _token', async () => {
        const res = await request(app).delete('/users/1/games_playing/17725').send({
            _token: "hellothere.generalkenobi"
        })

        expect(res.statusCode).toBe(401);
    });

    test('Removes game from games_playing list', async () => {
        const res = await request(app).delete('/users/1/games_playing/17725').send({
            username: testUser.username,
            password: testUser.password,
            _token: testUser._token
        })

        expect(res.statusCode).toBe(200)
    });
});

describe("DELETE /users", () => {
    test('Returns Unauthorized if invalid password', async () => {
        const res = await request(app).delete('/users/1').send({
            username: testUser.username,
            password: "nonsense",
            _token: testUser._token
        });

        expect(res.statusCode).toBe(401);
    });

    test('Returns Unauthorized if no _token', async () => {
        const res = await request(app).delete('/users/1').send({
            username: testUser.username,
            password: testUser.password,
        });

        expect(res.statusCode).toBe(401);
    });

    test('Returns 404 if invalid user id', async () => {
        const res = await request(app).delete('/users/0').send({
            username: testUser.username,
            password: testUser.password,
            _token: testUser._token
        });

        expect(res.statusCode).toBe(404);
    });

    test('Deletes a user', async () => {
        const res = await request(app).delete('/users/1').send({
            username: testUser.username,
            password: testUser.password,
            _token: testUser._token
        });
        const getRes = await request(app).get('/users/1');
        
        expect(res.statusCode).toBe(200);
        expect(getRes.statusCode).toBe(404);
    });
});

