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
    const res = await request(app).post('/users/register').send(testUser);
    if(res.statusCode === 201){
        testUser._token = res.body._token;
    }
});

afterAll(async () => {
    delete testUser._token;
    await db.query(`DELETE FROM users`)
    await db.query(`ALTER SEQUENCE users_id_seq RESTART WITH 1`);
    await db.end();
});

describe('GET /games', () => {
    test('Gets a list of all games', async () => {
        const res = await request(app).get('/games');
        expect(res.statusCode).toBe(200)
    });
});