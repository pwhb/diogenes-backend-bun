import { Handler, RouteSchema } from "elysia";
import { Collections, dbName } from "../lib/consts/db";
import clientPromise from "../lib/mongodb";
import { hash, isMatch } from "../lib/auth";

const collectionName = Collections.users;

export const register: Handler = async (context) =>
{
    try
    {
        const { username, password } = context.body as any;
        const client = await clientPromise;
        const db = client.db(dbName);
        const config = await db.collection(Collections.configs).findOne({ name: "auth" }) as any;

        const col = db.collection(collectionName);
        const hashed = await hash(password);
        const dbRes = await col.insertOne({
            username,
            password: hashed,
            ...config.register.default,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        context.set.status = 201;

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



        const isCorrect = await isMatch(password, alreadyExists.password);
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
                    username: alreadyExists.username,
                    active: alreadyExists.active,
                    role: alreadyExists.role
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
