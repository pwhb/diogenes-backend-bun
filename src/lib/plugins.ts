import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import jwtConf from "./jwt";
import cookie from "@elysiajs/cookie";

export const setup = new Elysia({ name: 'setup' })
    .use(cookie())
    .use(bearer())
    .use(jwt(jwtConf));