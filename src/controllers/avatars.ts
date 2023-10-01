import { Handler } from "elysia";
import clientPromise from "../lib/mongodb";
import { Collections, dbName } from "../lib/consts/db";

export const getMany: Handler = async (context) =>
{
    try
    {
        const client = await clientPromise;
        const col = client.db(dbName).collection(Collections.avatars);
        const docs = await col.find().toArray();
        const total = await col.countDocuments();

        return {
            data: docs,
            total: total
        };
    } catch (error)
    {
        console.error(error);
        return {
            error: error
        };
    }
};