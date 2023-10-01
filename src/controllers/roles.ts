import { Handler, InputSchema, MergeSchema, UnwrapRoute } from "elysia";
import { dbName, Collections } from "../lib/consts/db";
import clientPromise from "../lib/mongodb";
import { ObjectId } from "mongodb";

const collectionName = Collections.roles;

export const createOne: Handler = async (context) =>
{
    try
    {
        const body: any = context.body;
        const client = await clientPromise;
        const col = client.db(dbName).collection(collectionName);

        const alreadyExists = await col.findOne({ name: body.name });
        if (alreadyExists)
        {
            return {
                message: `role ${body.name} already exists.`
            };
        }
        const dbRes = await col.insertOne({
            ...body,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        context.set.status = 201;
        
        return {
            data: dbRes
        };
    } catch (error)
    {
        console.error(error);
        return {
            error: error
        };
    }
};

export const getOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/roles/:id">
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
            total: total,
            data: docs,
        };
    } catch (error)
    {
        console.error(error);
        return {
            error: error
        };
    }
};

export const updateOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/roles/:id"> = async (context) =>
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
    } catch (error)
    {
        console.error(error);
        return {
            error: error
        };
    }
};

export const replaceOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/roles/:id"> = async (context) =>
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
        return {
            error: error
        };
    }
};

export const deleteOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/roles/:id"> = async (context) =>
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
        return {
            error: error
        };
    }
};