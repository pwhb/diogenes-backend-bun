import Elysia, { t } from "elysia";
import Tags from "../lib/consts/tags";
import { changePassword, login, register } from "../controllers/auth";
import { setup } from "../lib/config/plugins";
import { authenticate, authorize } from "../middlewares/auth";
import { update } from "../middlewares/body";


const hook = { detail: { tags: [Tags.auth] } };

export const model = new Elysia()
    .model({
        auth: t.Object({
            username: t.String(),
            password: t.String()
        }),
        changePassword: t.Object({
            username: t.String(),
            password: t.String(),
            newPassword: t.String()
        })
    });

const authRouter = new Elysia({ prefix: `/auth` })
    .use(setup)
    .use(model)
    .post("/login", login, {
        ...hook,
        body: 'auth'
    })
    .post("/register", register, {
        ...hook,
        body: 'auth'
    })
    .post("/changePassword", changePassword, {
        ...hook,
        body: 'changePassword',
        beforeHandle: [authenticate, update, authorize]
    });

export default authRouter;