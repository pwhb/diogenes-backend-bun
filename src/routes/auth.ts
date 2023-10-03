import Elysia, { t } from "elysia";
import Tags from "../lib/consts/tags";
import { login, register } from "../controllers/auth";
import jwt from "@elysiajs/jwt";
import jwtConf from "../lib/jwt";
import { isMatch } from "../lib/auth";
import { Collections, dbName } from "../lib/consts/db";
import clientPromise from "../lib/mongodb";

const collectionName = Collections.users;
const hook = { detail: { tags: [Tags.auth] } };

const authRouter = new Elysia({ prefix: `/auth` })
    .use(jwt(jwtConf))
    .post("/login", async ({ body, set, jwt }) =>
    {
        try
        {
            const { username, password } = body as any;
            const client = await clientPromise;
            const col = client.db(dbName).collection(collectionName);

            const alreadyExists = await col.findOne({ username: username });
            if (!alreadyExists)
            {
                set.status = 404;
                return {
                    message: `user doesn't exists.`
                };
            }



            const isCorrect = await isMatch(password, alreadyExists.password);
            if (!isCorrect)
            {
                set.status = 400;
                return {
                    message: 'invalid credentials.'
                };
            }

            const token = await jwt.sign({ username });
            return {
                data: {
                    user: {
                        username: alreadyExists.username,
                        active: alreadyExists.active,
                        role: alreadyExists.role
                    },
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
    }, {
        ...hook,
        body: t.Object({
            username: t.String(),
            password: t.String(),
        })
    })
    .post("/register", register, hook);

export default authRouter;