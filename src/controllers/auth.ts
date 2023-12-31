import { Handler, RouteSchema } from "elysia";
import { Collections, dbName } from "../lib/consts/db";
import clientPromise from "../lib/services/mongodb";
import { hash, isMatch } from "../lib/services/auth";
import { ObjectId } from "mongodb";

const collectionName = Collections.users;

export const register: Handler = async ({ body, set }) =>
{
    try
    {
        const { username, password } = body as any;
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

export const login: Handler = async ({ body, set, jwt, setCookie }: any) =>
{
    try
    {
        const { username, password } = body as any;
        const client = await clientPromise;
        const col = client.db(dbName).collection(collectionName);

        const existingUser = await col.findOne({ username: username }, {
            projection: {
                createdAt: 0,
                updatedAt: 0,
                updatedBy: 0
            }
        });
        if (!existingUser)
        {
            set.status = 404;
            return {
                message: `user doesn't exists.`
            };
        }

        if (!existingUser.active)
        {
            set.status = 404;
            return {
                message: `user is deactivated.`
            };
        }

        const isCorrect = await isMatch(password, existingUser.password);
        if (!isCorrect)
        {
            set.status = 400;
            return {
                message: 'invalid credentials.'
            };
        }

        delete existingUser.password;

        const token = await jwt.sign({ _id: existingUser._id });
        return {
            data: {
                user: existingUser,
                token: token
            }
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


export const changePassword: Handler = async ({ body, set }: any) =>
{
    const { username, password, newPassword } = body;
    const client = await clientPromise;
    const col = client.db(dbName).collection(collectionName);

    const existingUser = await col.findOne({ username: username }) as any;

    const isCorrect = await isMatch(password, existingUser.password);
    if (!isCorrect)
    {
        set.status = 400;
        return {
            message: 'invalid credentials.'
        };
    }
    const hashed = await hash(newPassword);
    const update = await col.updateOne({ _id: new ObjectId(existingUser._id) }, {
        $set: {
            password: hashed
        }
    });
    return {
        message: "password updated successfully",
        data: update
    };
};