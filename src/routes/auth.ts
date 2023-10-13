import Elysia, { t } from "elysia";
import Tags from "../lib/consts/tags";
import { changePassword, login, register } from "../controllers/auth";
import { setup } from "../lib/config/plugins";
import { authenticate, authorize } from "../middlewares/auth";
import { update } from "../middlewares/body";
import userModel from "../models/users";


const hook = { detail: { tags: [Tags.auth] } };

const authRouter = new Elysia({ prefix: `/auth` })
    .use(setup)
    .use(userModel)
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