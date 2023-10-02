import { Handler, RouteSchema } from "elysia";
import { Collections, dbName } from "../lib/consts/db";
import clientPromise from "../lib/mongodb";
import { isMatch } from "../lib/auth";

const collectionName = Collections.users;

export const register: Handler = async (context) =>
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

export const login: Handler = async (context) =>
{
    try
    {
        const { username, password } = context.body as any;
        const client = await clientPromise;
        const col = client.db(dbName).collection(collectionName);

        const alreadyExists = await col.findOne({ username: username });
        if (!alreadyExists)
        {
            context.set.status = 404;
            return {
                message: `user doesn't exists.`
            };
        }


        const isCorrect = await isMatch(alreadyExists.password, password);
        if (!isCorrect)
        {
            context.set.status = 400;
            return {
                message: 'invalid credentials.'
            };
        }
        return {
            data: {
                user: {
                    ...alreadyExists
                }
            }
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
