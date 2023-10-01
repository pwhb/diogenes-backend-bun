import { Handler } from "elysia";
import { dbName, Collections } from "../lib/consts/db";
import clientPromise from "../lib/mongodb";
import { ObjectId } from "mongodb";

const collectionName = Collections.users;

export const getOne: Handler = async (context) =>
{
    try
    {
        const { id } = context.params;
        const client = await clientPromise;
        const col = client.db(dbName).collection(collectionName);
        const doc = await col.findOne({ _id: new ObjectId(id) });
        return {
            data: doc
        };
    } catch (error)
    {
        console.error(error);
        return {
            error: error
        };
    }
};

export const getMany: Handler = async (context) =>
{
    try
    {
        const client = await clientPromise;
        const col = client.db(dbName).collection(collectionName);
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