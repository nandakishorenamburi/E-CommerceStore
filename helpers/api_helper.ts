import { request } from '@playwright/test';

export async function createAPIContext() {
    return await request.newContext({
        baseURL: process.env.API_BASE_URL,
    });
}

export async function createWooCommerceContext() {
    return await request.newContext({
        baseURL: process.env.API_BASE_URL,
        extraHTTPHeaders: {
            Authorization: 'Basic ' + Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64')
        }
    });
}