import Elysia from "elysia";
import { createOne, deleteOne, getMany, getOne, replaceOne, updateOne } from "../controllers/routes";
import { Collections } from "../lib/consts/db";
import Tags from "../lib/consts/tags";
import { setup } from "../lib/plugins";
import { authenticate, authorize } from "../middlewares/auth";
import { create, update } from "../middlewares/body";

const hook = { detail: { tags: [Tags.routes] } };

const routeRouter = new Elysia({ prefix: `/${Collections.routes}` })
    .use(setup)
    // .post("/", createOne, {
    //     ...hook, beforeHandle: [authenticate, create, authorize]
    // })
    .get("/", getMany, hook)
    .get("/:id", getOne, hook)
    // .patch("/:id", updateOne, {
    //     ...hook, beforeHandle: [authenticate, update, authorize]
    // })
    // .put("/:id", replaceOne, {
    //     ...hook, beforeHandle: [authenticate, update, authorize]
    // })
    .delete("/:id", deleteOne, {
        ...hook, beforeHandle: [authenticate, authorize]
    });

export default routeRouter;