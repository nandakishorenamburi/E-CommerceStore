import {test, expect} from '@playwright/test';
import { createAPIContext } from '../../helpers/api_helper';


// test('GET Complete Verification', async ({request}) => {

//     const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    
//     expect(response.status()).toBe(200);
    
//     const post = await response.json();
    
//     console.log(post);
    



// //Field presence

// expect(post).toHaveProperty('id');
// expect(post).toHaveProperty('title');
// expect(post).toHaveProperty('body');


// // Field Types


// expect(typeof post.id).toBe('number');
// expect(typeof post.title).toBe('string');
// expect(typeof post.body).toBe('string');
// expect(typeof post.userId).toBe('number');

// // Field isn't just present, it's not empty
// expect(post.title.length).toBeGreaterThan(0);

// });





// test('POST a new Post to JSONPlaceholder',async({request})=>{
//     const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
//         data: {
//             title: 'My first post',
//             body: 'This is the content of my first post.',
//             userId: 1
//         }
//     });
//         const post = await response.json();
//         expect(response.status()).toBe(201);
//         expect(post.id).toBeTruthy();

    

// })


// test('GET Single Post from JSONPlaceholder', async ({request}) => {

//     const response = await request.get('https://jsonplaceholder.typicode.com/posts/55555');
    
//     expect(response.status()).toBe(404);
    
//     const post = await response.json();
    
//     // expect(post.id).toBe(1);
    
// });


// test('Use token to access protected endpoint', async ({request}) => {
//     const Loginresponse= await request.post('https://dummyjson.com/auth/login',
//         {
//             data:
//             {
//                 username: 'emilys',
//                 password: 'emilyspass'
//             },
//         }
    
//     )
//     expect(Loginresponse.status()).toBe(200);
//     const logindata = await Loginresponse.json();
//     console.log(logindata);
//     const {accessToken} = logindata

//     const response = await request.get('https://dummyjson.com/auth/me',
//         {
//             headers:{
//                 Authorization: `Bearer ${accessToken}`
//             }
//         }
        
//     )




//         expect(response.status()).toBe(200);
//         const responseData = await response.json();
//         console.log(responseData)
// })

test('Complete CRUD Workflow', async ({request}) => {
    // CREATE: send a POST request to add a new product
    const createResponse = await request.post('https://dummyjson.com/products/add', {
        data: {
            title: 'Test Product',
            price: 19.99,
            stock: 10
        }
    });

    expect(createResponse.status()).toBe(201);
    const createdProduct = await createResponse.json();
    expect(createdProduct).toHaveProperty('id');
    expect(createdProduct.title).toBe('Test Product');

    // READ: fetch the product by its id to verify it exists
    const productId = 1;
    const readResponse = await request.get(`https://dummyjson.com/products/${productId}`);
    expect(readResponse.status()).toBe(200);
    const readProduct = await readResponse.json();
    expect(readProduct.id).toBe(productId);
    expect(readProduct.title).toBe('Essence Mascara Lash Princess');

    // UPDATE: change the product values and confirm the modified fields
    const updateResponse = await request.put(`https://dummyjson.com/products/${productId}`, {
        data: {
            price: 79.99,
            stock: 15
        }
    });

    expect(updateResponse.status()).toBe(200);
    const updatedProduct = await updateResponse.json();
    expect(updatedProduct.price).toBe(79.99);
    expect(updatedProduct.stock).toBe(15);

    // DELETE: remove the product and verify it is marked deleted
    const deleteResponse = await request.delete(`https://dummyjson.com/products/${productId}`);
    expect(deleteResponse.status()).toBe(200);
    const deletedProduct = await deleteResponse.json();
    expect(deletedProduct.isDeleted).toBe(true);
    expect(deletedProduct.id).toBe(productId);
});

test('Get using reusable API Helper', async () => {
       const apiContext = await createAPIContext();
       const response = await apiContext.get('/wp-json/wc/store/products/3682');
       expect(response.status()).toBe(200);

       const product = await response.json();
       expect(product).toHaveProperty('id', 3682);

       await apiContext.dispose();
})