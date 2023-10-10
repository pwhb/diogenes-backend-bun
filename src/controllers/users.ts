import { Handler, InputSchema, MergeSchema, UnwrapRoute } from "elysia";
import { dbName, Collections } from "../lib/consts/db";
import clientPromise from "../lib/services/mongodb";
import { ObjectId } from "mongodb";
import { Key, Types, parseQuery, parseSort } from "../lib/query";

const collectionName = Collections.users;

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
        context.set.status = 500;
        return {
            error: error
        };
    }
};

export const getOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/users/:id">
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

export const getMany: Handler = async ({ query, set }) =>
{
    try
    {
        let { limit, page } = query as any;

        limit = parseInt(limit) || 20;
        page = parseInt(page) || 0;

        const filter = {};
        const keys: Key[] = [
            {
                key: "q",
                type: Types.Regex,
                searchedKeys: ["username", "role"]
            }
        ];
        parseQuery({
            filter,
            keys,
            query
        });
        const sort = parseSort(query);

        const client = await clientPromise;
        const col = client.db(dbName).collection(collectionName);
        const docs = await col.find(filter, { skip: limit * page, limit: limit, sort: sort, projection: { password: 0 } }).toArray();
        const total = await col.countDocuments(filter);

        return {
            total: total,
            data: docs,
        };
    } catch (error)
    {
        console.error(error);
        set.status = 500;
        return {
            error: error
        };
    }
};

export const updateOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/users/:id"> = async (context) =>
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
        context.set.status = 500;
        return {
            error: error
        };
    }
};

export const replaceOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/users/:id"> = async (context) =>
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

export const deleteOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/users/:id"> = async (context) =>
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