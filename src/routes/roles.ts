import Elysia from "elysia";
import { createOne, deleteOne, getMany, getOne, replaceOne, updateOne } from "../controllers/roles";
import { Collections } from "../lib/consts/db";


const roleRouter = new Elysia({ prefix: `/${Collections.roles}` })
    .post("/", createOne)
    .get("/", getMany)
    .get("/:id", getOne)
    .patch("/:id", updateOne)
    .put("/:id", replaceOne)
    .delete("/:id", deleteOne);

export default roleRouter;