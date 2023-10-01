import { Handler } from "elysia";
import { dbName, Collections } from "../lib/consts/db";
import clientPromise from "../lib/mongodb";

export const home: Handler = async (context) =>
{
    try
    {
        const client = await clientPromise;
        const col = client.db(dbName).collection(Collections.configs);
        const doc = await col.findOne({ name: "backend-configs" }) as any;
        return {
            ...doc["responses"]["root"],
            env: process.env.NODE_ENV
        };
    } catch (error)
    {
        console.error(error);
        return {
            error: error
        };
    }
};