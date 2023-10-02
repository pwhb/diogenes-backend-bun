import Elysia, { t } from "elysia";
import { createOne, deleteOne, getMany, getOne, replaceOne, updateOne } from "../controllers/configs";
import { Collections } from "../lib/consts/db";
import Tags from "../lib/consts/tags";

const hook = { detail: { tags: [Tags.configs] } };

const configRouter = new Elysia({ prefix: `/${Collections.configs}` })
    .post("/", createOne, hook)
    .get("/", getMany, hook)
    .get("/:id", getOne, hook)
    .patch("/:id", updateOne, hook);
// .put("/:id", replaceOne, hook)
// .delete("/:id", deleteOne, hook)

export default configRouter;