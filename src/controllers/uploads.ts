import { Handler, InputSchema, MergeSchema, UnwrapRoute } from "elysia";
import { Collections } from "../lib/consts/db";
import { ObjectId } from "mongodb";
import commondbClientPromise from "../lib/services/commondb";
import { get, remove, upload } from "../lib/services/s3";
import { Key, Types, parseQuery, parseSort } from "../lib/query";

const dbName = process.env.COMMON_DB_NAME;
const collectionName = Collections.uploads;

const uploadOneFile = async (file: any, fileType?: string, fileName?: string) =>
{

    const Key = `${new Date().valueOf()}_${fileName ? fileName : file.name}`;
    const data = await file.arrayBuffer();
    const ContentType = file.type ? file.type : fileType;
    const res = await upload({ Key, Body: Buffer.from(data), ContentType });
    if (res)
    {
        return {
            Key,
            Size: file.size,
            ContentType,
            Bucket: process.env.BUCKET_NAME,
            originalName: fileName ? fileName : file.name
        };
    }
};

export const createOne: Handler = async ({ body, set, request }: any) =>
{
    try
    {
        const res = await uploadOneFile(body.file, body.type, body.name);
        if (!res)
        {
            return {
                message: "failed to upload",
            };
        }
        const client = await commondbClientPromise;
        const col = client.db(dbName).collection(collectionName);
        const dbRes = await col.insertOne({ ...res, createdBy: request.user._id, createdAt: new Date() });
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

export const createMany: Handler = async ({ body, set, request }: any) =>
{
    try
    {
        const client = await commondbClientPromise;
        const col = client.db(dbName).collection(collectionName);
        const uploaded: any = [];
        const failed = [];
        if (body.files.length > 1)
        {
            for (let i in body.files)
            {
                const res = await uploadOneFile(
                    body.files[i],
                    body.types ? body.types[i] : "",
                    body.names ? body.names[i] : ""
                );
                if (res)
                {
                    uploaded.push({ ...res, createdBy: request.user._id, createdAt: new Date() });
                } else
                {
                    failed.push(body.files[i].name);
                }

            }
        } else
        {
            const res = await uploadOneFile(body.files, body.types, body.names);
            if (res)
            {
                uploaded.push({ ...res, createdBy: request.user._id, createdAt: new Date() });
            } else
            {
                failed.push(body.files.name);
            }
        }

        await col.insertMany(uploaded);
        if (uploaded.length)
        {
            set.status = 201;
            return {
                message: failed.length ?
                    `[${uploaded.length}/${body.files.length || 1}] partially uploaded` : `[${uploaded.length}/${body.files.length || 1}] uploaded successfully`,
            };
        }
        set.status = 406;
        return {
            message: "failed to upload",
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
export const getInfoById: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/uploads/getInfoById/:id">
    = async ({ params, set }) =>
    {
        try
        {
            const { id } = params;
            const client = await commondbClientPromise;
            const col = client.db(dbName).collection(collectionName);
            const dbRes = await col.findOne({ _id: new ObjectId(id) });
            if (!dbRes)
            {
                set.status = 404;
                return {
                    message: "not found",
                };
            }
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


export const getOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/uploads/:id">
    = async ({ params, set }) =>
    {
        try
        {
            const { id } = params;
            const client = await commondbClientPromise;
            const col = client.db(dbName).collection(collectionName);
            const dbRes = await col.findOne({ _id: new ObjectId(id) });
            if (!dbRes)
            {
                set.status = 404;
                return {
                    message: "not found",
                };
            }
            const s3Res = (await get(dbRes!.Key)) as any;
            const arrayBuffer = await s3Res.Body.transformToByteArray();
            return new Response(arrayBuffer, {
                headers: {
                    "Content-Type": dbRes.ContentType,
                }
            });
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
                searchedKeys: ["Key", "ContentType"]
            },
            {
                key: "type",
                type: Types.Regex,
                searchedKeys: ["ContentType"]
            }
        ];
        parseQuery({
            filter,
            keys,
            query
        });
        const sort = parseSort(query);

        const client = await commondbClientPromise;
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

export const updateOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/uploads/:id"> = async ({ params, body, set }) =>
{
    try
    {
        const { id } = params;

        const client = await commondbClientPromise;
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

export const replaceOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/uploads/:id"> = async ({ params, body, set }) =>
{
    try
    {
        const { id } = params;
        const client = await commondbClientPromise;
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

export const deleteOne: Handler<MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>, { request: {}; store: {}; }, "/uploads/:id"> = async ({ params, set }) =>
{
    try
    {
        const { id } = params;
        const client = await commondbClientPromise;
        const col = client.db(dbName).collection(collectionName);
        const dbRes = await col.findOne({ _id: new ObjectId(id) });
        if (!dbRes)
        {
            set.status = 404;
            return {
                message: "not found",
            };
        }
        const s3Res = await remove(dbRes.Key);
        if (!s3Res)
        {
            return {
                message: "failed to delete",
            };
        }
        const deleted = await col.deleteOne({ _id: new ObjectId(id) });
        return {
            data: deleted,
            s3: s3Res
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