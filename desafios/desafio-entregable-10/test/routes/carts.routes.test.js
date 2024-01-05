import supertest from 'supertest';
import { expect } from 'chai';

const requester = supertest('http://localhost:8080/api');

describe('Carts Controller', () => {
    describe('GET /carts', () => {
        it('devuelve todos los carritos de compra, con codigo de estado 200', async () => {
            const mockCarts = {
                status: "success",
                result: [
                    {
                        id: "6540152c217558f037c0c422",
                        products: []
                    },
                    {
                        id: "65402b4e45564459a8375ffc",
                        products: []
                    },
                    {
                        id: "65402cf8ed8979574b028504",
                        products: []
                    }
                ]
            }
            const response = await requester
                .get('/carts')
                .send(mockCarts)
                .expect(200);

            expect(response.body.status).to.equal('success');
            expect(response.body.result).to.be.an('array');
        });
    });

    describe('GET /carts/:cid', () => {
        it('devuelve un carrito de compra por ID, con codigo de estado 200', async () => {
            const mockCarts = {
                status: "success",
                result: [
                    {
                        id: "6540152c217558f037c0c422",
                        products: []
                    }
                ]
            }

            const mockIdCart = '6540152c217558f037c0c422';

            const response = await requester
                .get(`/carts/${mockIdCart}`)
                .send(mockCarts)
                .expect(200);

            expect(response.body.status).to.equal('success');
            expect(response.body.result).to.be.an('object');
            expect(response.body.result.id).to.equal(mockIdCart);
        });

        it('no devuelve un carrito de compra por ID, con codigo de estado 500', async () => {
            const mockCarts = {
                status: "error",
                code: "20112",
                message: "Carrito de compra no encontrado para el filtro aplicado"
            }
            const response = await requester
                .get('/carts/a1')
                .send(mockCarts)
                .expect(500);

            expect(response.body.status).to.equal('error');
            expect(response.body.code).to.equal('20112');
        });
    });

    describe('POST /carts', () => {
        it('crea un carrito de compras, con codigo de estado 200', async () => {
            const mockCarts = {
                status: "success",
                message: "Carrito de compra creado exitosamente",
                result: {
                    id: "656c7c6582afb0df15f4ccd4",
                    products: [],
                }
            }
            const response = await requester
                .post('/carts')
                .send(mockCarts)
                .expect(201);

            expect(response.body.status).to.equal('success');
            expect(response.body.result).to.be.an('object');
        });
    });

});