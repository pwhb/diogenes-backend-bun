import Elysia, { t } from "elysia";
import { changePassword, createOne, deleteOne, getMany, getOne, replaceOne, updateOne, updateSelf } from "../controllers/users";
import { Collections } from "../lib/consts/db";
import Tags from "../lib/consts/tags";
import { update } from "../middlewares/body";
import { authenticate, authorize, authorizeSelf } from "../middlewares/auth";
import { setup } from "../lib/config/plugins";

const hook = { detail: { tags: [Tags.users] } };

const userRouter = new Elysia({ prefix: `/${Collections.users}` })
    .use(setup)
    // .post("/", createOne, hook)
    .get("/", getMany, hook)
    .get("/:id", getOne, hook)
    .patch("/update", updateSelf, {
        ...hook, beforeHandle: [authenticate, update]
    })
    .patch("/changePassword", changePassword, {
        ...hook, beforeHandle: [authenticate, update]
    })
    .patch("/:id", updateOne, {
        ...hook, beforeHandle: [authenticate, update, authorize]
    })
    // .put("/:id", replaceOne, hook)
    .delete("/:id", deleteOne, {
        ...hook, beforeHandle: [authenticate, authorize]
    });

export default userRouter;