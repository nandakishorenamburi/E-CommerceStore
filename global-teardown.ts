async function deleteuserOrders(apiContext: any) {
    const response = await apiContext.get('/wp-json/wc/v3/orders', {
        params: {
            per_page: 2,
        },
    });
    const orders = await response.json();
    console.log(`Found ${orders.length} orders to delete`);

    for (const order of orders) {
        console.log(`Deleting order ${order.id}`);
        await apiContext.delete(`/wp-json/wc/v3/orders/${order.id}`, {
            params: {
                force: true,
            },
        });
    }
}

async function deleteTestOrders(apiContext: any) {
    const response = await apiContext.get('/wp-json/wc/v3/orders', {
        params: {
            per_page: 2,
        },
    });
    const orders = await response.json();
    console.log(`Found ${orders.length} orders to delete`);

    for (const order of orders) {
        console.log(`Deleting order ${order.id}`);
        await apiContext.delete(`/wp-json/wc/v3/orders/${order.id}`, {
            params: {
                force: true,
            },
        });
    }
}

import { createWooCommerceContext } from './helpers/api_helper';

export default async function globalTeardown() {
    const apiContext = await createWooCommerceContext();

     try {
    //     const response = await apiContext.get('/wp-json/wc/v3/orders', {
    //         params: {
    //             per_page: 100,
    //         },
    //     });
    //     const orders = await response.json();
    //     console.log(orders.length);
    //     console.log(`Found ${orders.length} orders to delete`);

    //     for (const order of orders) {
    //         console.log(`Deleting order ${order.id}`);
    //         await apiContext.delete(`/wp-json/wc/v3/orders/${order.id}`, {
    //             params: {
    //                 force: true,
    //             },
    //         });
    //     }} 
            await deleteTestOrders(apiContext);
            await deleteuserOrders(apiContext);
     }
    finally {
        await apiContext.dispose();
    }
}