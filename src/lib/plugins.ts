import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import jwtConf from "./jwt";

export const setup = new Elysia({ name: 'setup' })
    .use(bearer())
    .use(jwt(jwtConf));