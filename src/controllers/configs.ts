import { Handler, InputSchema, MergeSchema, UnwrapRoute } from "elysia";
import { dbName, Collections } from "../lib/consts/db";
import clientPromise from "../lib/mongodb";
import { ObjectId } from "mongodb";

const collectionName = Collections.configs;

export const createOne: Handler = async ({ body, set }) =>
{
    try
    {
        const client = await clientPromise;
        const col = client.db(dbName).collection(Collections.configs);

        const dbRes = await col.insertOne(body as any);

        set.status = 201;

        return {
            data: dbRes
        };
    } catch (error: any)
    {
        console.error(error);
        if (error.code && error.code === 11000)
        {
            set.status = 400;
            return {
                code: error.code,
                error: error.message,
            };
        }
        set.status = 500;
        return {
            error: error
        };
    }
};

export const getOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/configs/:id">
    = async (context) =>
    {
        try
        {
            const { id } = context.params;
            const client = await clientPromise;
            const col = client.db(dbName).collection(collectionName);
            const dbRes = await col.findOne({ _id: new ObjectId(id) });
            return {
                data: dbRes
            };
        } catch (error)
        {
            console.error(error);
            context.set.status = 500;
            return {
                error: error
            };
        }
    };

export const getMany: Handler = async (context) =>
{
    try
    {
        let { limit, page } = context.query as any;

        limit = parseInt(limit) || 20;
        page = parseInt(page) || 0;

        const client = await clientPromise;
        const col = client.db(dbName).collection(collectionName);
        const docs = await col.find({}, { skip: limit * page, limit: limit, sort: { createdAt: -1 } }).toArray();
        const total = await col.countDocuments();

        return {
            total: total,
            data: docs,
        };
    } catch (error)
    {
        console.error(error);
        context.set.status = 500;
        return {
            error: error
        };
    }
};

export const updateOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/configs/:id"> = async (context) =>
{
    try
    {
        const { id } = context.params;
        const body: any = context.body;
        const client = await clientPromise;
        const col = client.db(dbName).collection(collectionName);
        const dbRes = await col.findOneAndUpdate({
            _id: new ObjectId(id)
        }, {
            $set: {
                ...body,
                updatedAt: new Date()
            }
        }, {
            returnDocument: "after"
        });
        return {
            data: dbRes
        };
    } catch (error: any)
    {
        console.error(error);
        if (error.code && error.code === 11000)
        {
            context.set.status = 400;
            return {
                code: error.code,
                error: error.message,
            };
        }
        context.set.status = 500;
        return {
            error: error
        };
    }
};

export const replaceOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/configs/:id"> = async (context) =>
{
    try
    {
        const { id } = context.params;
        const body: any = context.body;
        const client = await clientPromise;
        const col = client.db(dbName).collection(collectionName);
        const dbRes = await col.findOneAndReplace({
            _id: new ObjectId(id)
        }, {
            ...body,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            returnDocument: "after"
        });
        return {
            data: dbRes
        };
    } catch (error)
    {
        console.error(error);
        context.set.status = 500;
        return {
            error: error
        };
    }
};

export const deleteOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/configs/:id"> = async (context) =>
{
    try
    {
        const { id } = context.params;
        const client = await clientPromise;
        const col = client.db(dbName).collection(collectionName);
        const dbRes = await col.deleteOne({ _id: new ObjectId(id) });
        return {
            data: dbRes
        };
    } catch (error)
    {
        console.error(error);
        context.set.status = 500;
        return {
            error: error
        };
    }
};