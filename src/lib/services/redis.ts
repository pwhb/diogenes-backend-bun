import { createClient } from 'redis';

const client = await createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT as string)
    }
})
    .on('error', err => console.log('Redis Client Error', err))
    .connect();


const DEFAULT_SECONDS = 5 * 60;

export async function fetchViaRedis(key: string, callback: () => any)
{
    const cached = await client.get(key);
    if (cached)
    {
        return JSON.parse(cached);
    }
    const data = await callback();
    await client.setEx(key, DEFAULT_SECONDS, JSON.stringify(data));
    return data;
}