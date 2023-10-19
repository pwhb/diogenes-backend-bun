import { Handler, InputSchema, MergeSchema, UnwrapRoute } from "elysia";
import { dbName, Collections } from "../lib/consts/db";
import clientPromise from "../lib/services/mongodb";
import { Filter, ObjectId, Sort } from "mongodb";
import { Key, Types, parseQuery, parseSort } from "../lib/query";

const collectionName = Collections.assets;

export const createOne: Handler = async ({ body, set }) =>
{
    try
    {
        const client = await clientPromise;
        const col = client.db(dbName).collection(collectionName);

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

export const getOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/assets/:id">
    = async ({ params, set }) =>
    {
        try
        {
            const { id } = params;
            const client = await clientPromise;
            const col = client.db(dbName).collection(collectionName);
            const dbRes = await col.findOne({ _id: new ObjectId(id) });
            return {
                data: dbRes
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
                searchedKeys: ["name"]
            },
            {
                key: "category",
                type: Types.String
            },
            {
                key: "type",
                type: Types.String
            },
            {
                key: "source",
                type: Types.String
            },
            {
                key: "active",
                type: Types.Boolean
            },
        ];
        parseQuery({
            filter,
            keys,
            query
        });
        const sort = parseSort(query);

        const client = await clientPromise;
        const col = client.db(dbName).collection(collectionName);
        const docs = await col.find(filter, { skip: limit * page, limit: limit, sort: sort }).toArray();
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

export const updateOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/assets/:id"> = async ({ params, body, set }) =>
{
    try
    {
        const { id } = params;

        const client = await clientPromise;
        const col = client.db(dbName).collection(collectionName);
        const dbRes = await col.findOneAndUpdate({
            _id: new ObjectId(id)
        }, {
            $set: body as any
        }, {
            returnDocument: "after"
        });
        return {
            data: dbRes
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

export const replaceOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/assets/:id"> = async ({ params, body, set }) =>
{
    try
    {
        const { id } = params;
        const client = await clientPromise;
        const col = client.db(dbName).collection(collectionName);
        const dbRes = await col.findOneAndReplace({
            _id: new ObjectId(id)
        }, body as any, {
            returnDocument: "after"
        });
        return {
            data: dbRes
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

export const deleteOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/assets/:id"> = async ({ params, set }) =>
{
    try
    {
        const { id } = params;
        const client = await clientPromise;
        const col = client.db(dbName).collection(collectionName);
        const dbRes = await col.deleteOne({ _id: new ObjectId(id) });
        return {
            data: dbRes
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