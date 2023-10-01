import Elysia from "elysia";
import { createOne, deleteOne, getMany, getOne, replaceOne, updateOne } from "../controllers/roles";
import { Collections } from "../lib/consts/db";
import Tags from "../lib/consts/tags";

const hook = { detail: { tags: [Tags.roles] } };

const roleRouter = new Elysia({ prefix: `/${Collections.roles}` })
    .post("/", createOne, hook)
    .get("/", getMany, hook)
    .get("/:id", getOne, hook)
    .patch("/:id", updateOne, hook)
    .put("/:id", replaceOne, hook)
    .delete("/:id", deleteOne, hook);

export default roleRouter;