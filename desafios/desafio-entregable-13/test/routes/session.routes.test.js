import supertest from 'supertest';
import { expect } from 'chai';

const requester = supertest('http://localhost:8080/api');

describe('Sessions Controller', () => {
    describe('POST /session/register', () => {
        const sessionMock = {
            firstname: "test",
            lastname: "test",
            email: "test@test",
            age: "100",
            password: "123",
        }
        it('registra un nuevo usuario, con codigo de estado 201', async () => {
            const response = await requester
                .post('/sessions/register')
                .send(sessionMock)
                .expect(201);

            expect(response.body.status).to.equal('success');
        });

        it('no regitra un nuevo usuario, con codigo de estado 500', async () => {
            const response = await requester
                .post('/sessions/register')
                .send({})
                .expect(500);

            expect(response.body.status).to.equal('error');
        });
    });

    describe('POST /session/login', () => {
        it('logueo del usuario, con codigo de estado 200', async () => {
            const sessionMock = {
                email: "test@test",
                password: "123",
            }
            const response = await requester
                .post('/sessions/login')
                .send(sessionMock)
                .expect(200);

            expect(response.body.status).to.equal('success');
        });

        it('error logueo del usuario, con codigo de estado 500', async () => {
            const sessionMock = {
                email: "test@test",
            }
            const response = await requester
                .post('/sessions/login')
                .send(sessionMock)
                .expect(500);

            expect(response.body.status).to.equal('error');
        });
    });

    describe('GET /session/authFail', () => {
        it('autenticacion en error, con codigo de estado 401', async () => {
            const response = await requester
                .get('/sessions/authFail')
                .expect(401);

            expect(response.body.status).to.equal('error');
        });
    });

});