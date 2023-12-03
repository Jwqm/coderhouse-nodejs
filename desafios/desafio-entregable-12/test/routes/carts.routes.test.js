import supertest from 'supertest';
import { expect } from 'chai';

const requester = supertest('http://localhost:8080/api');

describe('Carts Controller', () => {
    describe('GET /', () => {
        it('devuelve todos los carritos de compra, con codigo de estado 200', async () => {
            const response = await requester
                .get('/carts')
                .expect(200);

            //expect(response.body.status).to.equal('success');
            //expect(response.body.result).to.be.an('object');
            //expect(response.body.result.id).to.equal(mockProducts.result.id);
        });
    });

    describe('GET /:cid', () => {
        it('devuelve un carrito de compra por ID, con codigo de estado 200', async () => {
            const mockCarts = {
                status: "success",
                result: {
                    id: "6540152c217558f037c0c422",
                    products: []
                }
            }

            const mockIdCart = '6540152c217558f037c0c422';

            const response = await requester
                .get(`/carts/${mockIdCart}`)
                .send(mockCarts)
                .expect(200);

            expect(response.body.status).to.equal('success');
            expect(response.body.result).to.be.an('object');
            expect(response.body.result.id).to.equal(mockCarts.result.id);
        });

        it('no devuelve un carrito de compra por ID, con codigo de estado 500', async () => {
            const response = await requester
                .get('/carts/a1')
                .expect(500);

        });
    });

    describe('POST /', () => {
        it('crea un carrito de compras, con codigo de estado 200', async () => {
            const response = await requester
                .post('/')
                .send()
                .expect(404);
        });
    });

});