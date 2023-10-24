import { Handler } from "elysia";
import { dbName, Collections } from "../lib/consts/db";
import clientPromise from "../lib/services/mongodb";

export const home: Handler = async (context) =>
{
    try
    {
        // const client = await clientPromise;
        // const col = client.db(dbName).collection(Collections.configs);
        // const doc = await col.findOne({ name: "backend" }) as any;

        return {
            name: "diogenes backend",
            documentation: "/swagger"
        };
    } catch (error)
    {
        console.error(error);
        return {
            error: error
        };
    }
};