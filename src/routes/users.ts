import Elysia, { t } from "elysia";

import { Collections } from "../lib/consts/db";
import Tags from "../lib/consts/tags";
import { createOne, deleteOne, getMany, getOne, updateOne } from "../controllers/users";

const hook = { detail: { tags: [Tags.users] } };

const userRouter = new Elysia({ prefix: `/${Collections.users}` })
    .post("/", createOne, hook)
    .get("/", getMany, hook)
    .get("/:id", getOne, hook)
    .patch("/:id", updateOne, hook)
    // .put("/:id", replaceOne, hook)
    .delete("/:id", deleteOne, hook);

export default userRouter;