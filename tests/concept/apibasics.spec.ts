import {test, expect} from '@playwright/test';
import { CreateAPIContext} from '../../helpers/api_helper';



test('Login Using Custom API Helper', async () => 
{
                const apiContext = await CreateAPIContext();
                const response = await apiContext.get('https://dummyjson.com/posts/1',)
                expect(response.status()).toBe(200);
                const posts= await response.json()
                console.log(posts);
                
                expect(posts).toHaveProperty('id', 1);
                
                await apiContext.dispose();     
})


