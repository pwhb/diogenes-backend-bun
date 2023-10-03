import Elysia, { t } from "elysia";
import { createOne, deleteOne, getMany, getOne, replaceOne, updateOne } from "../controllers/users";
import { Collections } from "../lib/consts/db";
import Tags from "../lib/consts/tags";
import { update } from "../middlewares/body";
import { authenticate, authorize } from "../middlewares/auth";
import { setup } from "../lib/plugins";

const hook = { detail: { tags: [Tags.users] } };

const userRouter = new Elysia({ prefix: `/${Collections.users}` })
    .use(setup)
    // .post("/", createOne, hook)
    .get("/", getMany, hook)
    .get("/:id", getOne, hook)
    .patch("/:id", updateOne, {
        ...hook, beforeHandle: [authenticate, update, authorize]
    });
// .put("/:id", replaceOne, hook)
// .delete("/:id", deleteOne, hook);

export default userRouter;