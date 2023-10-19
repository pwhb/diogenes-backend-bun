import { Handler, InputSchema, MergeSchema, UnwrapRoute } from "elysia";
import { dbName, Collections } from "../lib/consts/db";
import clientPromise from "../lib/services/mongodb";
import { Filter, ObjectId, Sort } from "mongodb";
import { Key, Types, parseQuery, parseSort } from "../lib/query";
import { RoomTypes } from "../models/rooms";

const collectionName = Collections.followings;

export const createOne: Handler = async ({ body, set, request }: any) =>
{
    try
    {
        const client = await clientPromise;
        const db = client.db(dbName);

        const { followed } = body as any;

        const dbRes = await db.collection(collectionName).insertOne({
            followed: new ObjectId(followed),
            follower: request.user._id,
        });

        set.status = 201;

        const alreadyFollowed = await db.collection(collectionName).findOne({
            followed: request.user._id,
            follower: new ObjectId(followed),
        });

        if (alreadyFollowed)
        {
            const existingRoom = await db.collection(Collections.rooms).findOne({
                type: RoomTypes.friendship,
                $or: [
                    { members: [new ObjectId(followed), request.user._id] },
                    { members: [request.user._id, new ObjectId(followed)] }
                ]
            });
            if (!existingRoom)
            {
                await db.collection(Collections.rooms).insertOne({
                    slug: `${followed}_${request.user._id}`,
                    members: [new ObjectId(followed), request.user._id],
                    type: RoomTypes.friendship,
                    active: [true, true],
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
        }


        return {
            data: {
                following: dbRes
            }
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

export const unfollowOne: Handler = async ({ body, set, request }: any) =>
{
    try
    {
        const client = await clientPromise;
        const col = client.db(dbName).collection(collectionName);
        const { followed } = body as any;

        const dbRes = await col.deleteOne({
            followed: new ObjectId(followed),
            follower: request.user._id,
        });

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

export const getOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/followings/:id">
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
                key: "follower",
                type: Types.ObjectId
            },
            {
                key: "followed",
                type: Types.ObjectId
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

export const updateOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/followings/:id"> = async ({ params, body, set }) =>
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

export const replaceOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/followings/:id"> = async ({ params, body, set }) =>
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

export const deleteOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/followings/:id"> = async ({ params, set }) =>
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