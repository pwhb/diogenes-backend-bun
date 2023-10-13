import Elysia, { t } from "elysia";
import { changePassword, createOne, deleteOne, getMany, getOne, replaceOne, updateOne, updateSelf } from "../controllers/users";
import { Collections } from "../lib/consts/db";
import Tags from "../lib/consts/tags";
import { update } from "../middlewares/body";
import { authenticate, authorize, authorizeSelf } from "../middlewares/auth";
import { setup } from "../lib/config/plugins";
import userModel from "../models/users";

const hook = { detail: { tags: [Tags.users] } };



const userRouter = new Elysia({ prefix: `/${Collections.users}` })
    .use(setup)
    .use(userModel)
    // .post("/", createOne, hook)
    .get("/", getMany, hook)
    .get("/:id", getOne, hook)
    .patch("/update", updateSelf, {
        ...hook,
        beforeHandle: [authenticate, update],
        body: "self"
    })
    .patch("/changePassword", changePassword, {
        ...hook,
        beforeHandle: [authenticate, update],
        body: "changePassword"
    })
    .patch("/:id", updateOne, {
        ...hook,
        beforeHandle: [authenticate, update, authorize],
        body: "user"
    })
    // .put("/:id", replaceOne, hook)
    .delete("/:id", deleteOne, {
        ...hook, beforeHandle: [authenticate, authorize]
    });

export default userRouter;