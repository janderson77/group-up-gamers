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

// beforeAll(async() => {
//     const res = await request(app).post('/users/register').send(testUser);
//     if(res.statusCode === 201){
//         testUser._token = res.body._token;
//     }
// });

// afterAll(async () => {
//     delete testUser._token;
//     await db.query(`DELETE FROM users`)
//     await db.query(`ALTER SEQUENCE users_id_seq RESTART WITH 1`);
//     await db.end();
// });

describe('GET /games', () => {
    test('Gets a list of all games', async () => {
        const res = await request(app).get('/games');
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty("games")
        expect(res.body.games[0]).toHaveProperty("id")
        expect(res.body.games[0]).toHaveProperty("game_name")
        expect(res.body.games[0]).toHaveProperty("slug")
        expect(res.body.games[0]).toHaveProperty("cover_art")
        expect(res.body.games[0]).toHaveProperty("summary")
        expect(res.body.games[0]).toHaveProperty("platforms")
        expect(res.body.games[0]).toHaveProperty("game_modes")
    });
});

describe('GET /games/min', () => {
    test('Gets a list of all games with reduced info', async() => {
        const res = await request(app).get('/games/min');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body[0])).toBe(true);
        expect(res.body[0][0]).toHaveProperty('id');
        expect(res.body[0][0]).toHaveProperty('game_name');
        expect(res.body[0][0]).toHaveProperty('slug');
    });
});

describe('POST /games/search', () => {
    test('Finds a list of games that match the search query', async() => {
        const res = await request(app).post('/games/search').send({search: "doom"});
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body[0])).toBe(true);
        expect(res.body[0][0].id).toEqual(4269);
    });
    test('Returns an empty array if query does not find anything', async() => {
        const res = await request(app).post('/games/search').send({search: "asogunSOGNOa"});
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body[0])).toBe(true); 
        expect(res.body[0].length).toBe(0);
    });

    test('Returns an empty array if no query provided', async() => {
        const res = await request(app).post('/games/search');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body[0])).toBe(true); 
        expect(res.body[0].length).toBe(0);
    });

    test('Returns an empty array if query is invalid', async() => {
        const res = await request(app).post('/games/search').send({dog: "asogunSOGNOa"});
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body[0])).toBe(true); 
        expect(res.body[0].length).toBe(0);
    });
});

describe('GET /games/:slug', () => {
    test('Returns game information for :slug', async() => {
        const res = await request(app).get('/games/doom');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("game");
        expect(res.body.game.id).toBe(17725);
        expect(res.body.game.slug).toBe("doom");
    })

    test('Returns 404 for invalid slug', async() => {
        const res = await request(app).get('/games/doomsfadsf');

        expect(res.statusCode).toBe(404);
    })
});