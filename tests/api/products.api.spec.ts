import {test,expect} from '@playwright/test';

test('GET product list from a store', async ({request}) => {

    const response= await request.get('https://qa-cart.com/wp-json/wc/store/products');
    expect(response.status()).toBe(200);

    const products = await response.json();
    console.log(products);
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);

    const firstProduct = products[0];
    expect(firstProduct).toHaveProperty('id');
    expect(firstProduct).toHaveProperty('name');
    expect(firstProduct.prices).toHaveProperty('price');
    expect(firstProduct).toHaveProperty('description');

})
test('GET a Single product by id', async ({request}) => {

    const response = await request.get('https://qa-cart.com/wp-json/wc/store/products/3682');
    expect(response.status()).toBe(200);

    const product = await response.json();
    expect(product).toHaveProperty('id', 3682);
    expect(product).toHaveProperty('name');
});
