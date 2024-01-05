import supertest from 'supertest';
import { expect } from 'chai';

const requester = supertest('http://localhost:8080/api');

describe('Products Controller', () => {
    describe('GET /products', () => {
        const mockProducts = {
            status: "success",
            result: {
                payload: [
                    {
                        id: "654009bf714e411198ebc585",
                        title: "LG TV 20 Pulgadas",
                        description: "LG TV 20 Pulgadas",
                        category: "LG",
                        price: 50000,
                        thumbnails: [
                            "test1",
                            "test2"
                        ],
                        code: "A",
                        stock: 842
                    },
                    {
                        id: "654009db714e411198ebc589",
                        title: "LG TV 32 Pulgadas",
                        description: "LG TV 32 Pulgadas",
                        category: "LG",
                        price: 80000,
                        thumbnails: [
                            "xx",
                            "yy"
                        ],
                        code: "B",
                        stock: 957
                    },
                    {
                        id: "654009f2714e411198ebc58d",
                        title: "SAMSUNG TV 32 Pulgadas",
                        description: "SAMSUNG TV 32 Pulgadas",
                        category: "SAMSUNG",
                        price: 70000,
                        thumbnails: [
                            "xx",
                            "yy"
                        ],
                        code: "C",
                        stock: 971
                    }
                ],
                totalPages: 1,
                prevPage: null,
                nextPage: null,
                page: 1,
                hasPrevPage: false,
                hasNextPage: false,
                prevLink: null,
                nextLink: null
            }
        }
        it('devuelve un código de estado 200 en éxito', async () => {
            const response = await requester
                .get('/products')
                .send(mockProducts)
                .expect(200);

            expect(response.body.status).to.equal('success');
            expect(response.body.result).to.be.an('object');
            expect(response.body.result.payload).to.be.an('array');
        });

        it('devuelve un código de estado 200 con parámetro limit', async () => {
            const response = await requester
                .get('/products?limit=2')
                .expect(200);

            expect(response.body.status).to.equal('success');
            expect(response.body.result).to.be.an('object');
            expect(response.body.result.payload).to.be.an('array');
            expect(response.body.result.payload.length).to.be.at.most(2)
        });
    });

    describe('GET /products/{pid}', () => {
        it('devuelve un producto por ID y devuelve un código de estado 200', async () => {
            const mockProducts = {
                status: "success",
                result: {
                    id: "654009bf714e411198ebc585",
                    title: "LG TV 20 Pulgadas",
                    description: "LG TV 20 Pulgadas",
                    category: "LG",
                    price: 50000,
                    thumbnails: [
                        "test1",
                        "test2"
                    ],
                    code: "A",
                    stock: 842
                }
            }
            const mockIdProduct = '654009bf714e411198ebc585';

            const response = await requester
                .get(`/products/${mockIdProduct}`)
                .send(mockProducts)
                .expect(200);

            expect(response.body.status).to.equal('success');
            expect(response.body.result).to.be.an('object');
            expect(response.body.result.id).to.equal(mockProducts.result.id);
        });
        it('devuelve un mensaje de error cuando se ingresa un ID diferente', async () => {
            const nonExistentId = '1';

            const response = await requester
                .get(`/products/${nonExistentId}`)
                .expect(500);

            expect(response.body.status).to.equal('error');
            expect(response.body.code).to.equal('20012');
            expect(response.body.message).to.equal('Error al obtener el producto');
        });
    });
});
// Pruebas para el endpoint POST /products
/*describe('POST /products', () => {
    it('crea un nuevo producto y devuelve un código de estado 201', async () => {
        const userObject = { id: 123, role: 'ADMIN' };
        const passportCallStub = sinon.stub(passportCall, 'passportCall').callsFake((strategy, options) => {
          return (req, res, next) => {
            req.user = userObject;
            next();
          };
        });

        const newProduct = {
            title: 'Nuevo Producto',
            description: 'Descripción del nuevo producto',
            code: 'ABC123',
            price: 19.99,
            status: true,
            stock: 100,
            category: 'Electrónicos',
            thumbnails: ['url1', 'url2'],
        };

        const response = await requester
            .post('/products')
            .send(newProduct)
            .expect(201);

    });
});*/



// Pruebas para el endpoint PUT /products/{pid}
/*describe('PUT /products/{pid}', () => {
  it('actualiza un producto existente y devuelve un código de estado 200', async () => {
    const productId = '654009bf714e411198ebc585';
    const updatedProduct = {
        status: "success",
        result: {
            id: "654009bf714e411198ebc585",
            title: "LG TV 20 Pulgadas",
            description: "LG TV 20 Pulgadas",
            category: "LG",
            price: 50000,
            thumbnails: [
                "test1",
                "test2"
            ],
            code: "A",
            stock: 842
        }
    };

    const response = await requester
      .put(`/products/${productId}`)
      .send(updatedProduct)
      .expect(200);

      expect(response.body.status).to.equal('success');
      expect(response.body.result).to.be.an('object');
      expect(response.body.result.id).to.equal(mockProducts.result.id);
  });
});*/

// Pruebas para el endpoint DELETE /products/{pid}
/*describe('DELETE /products/{pid}', () => {
    it('elimina un producto existente y devuelve un código de estado 204', async () => {
        const mockIdProduct = '654009bf714e411198ebc585'; // Reemplaza con un ID real existente
        const response = await requester
            .delete(`/products/${mockIdProduct}`)
            .expect(200);
        // Asegurarse de que no haya cuerpo de respuesta (204 no debe tener contenido)
        //expect(response.text).to.equal('');
    });
});*/