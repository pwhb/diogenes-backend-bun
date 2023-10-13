import Elysia, { t } from "elysia";
import { createOne, deleteOne, getMany, getOne, replaceOne, updateOne } from "../controllers/routes";
import { Collections } from "../lib/consts/db";
import Tags from "../lib/consts/tags";
import { setup } from "../lib/config/plugins";
import { authenticate, authorize } from "../middlewares/auth";
import { create, update } from "../middlewares/body";
import routeModel from "../models/routes";

const hook = { detail: { tags: [Tags.routes] } };

const routeRouter = new Elysia({ prefix: `/${Collections.routes}` })
    .use(setup)
    .use(routeModel)
    .post("/", createOne, {
        ...hook,
        beforeHandle: [authenticate, create, authorize],
        body: 'route'
    })
    .get("/", getMany, hook)
    .get("/:id", getOne, hook)
    .patch("/:id", updateOne, {
        ...hook,
        beforeHandle: [authenticate, update, authorize],
        body: 'route'
    })
    // .put("/:id", replaceOne, {
    //     ...hook, beforeHandle: [authenticate, update, authorize]
    // })
    .delete("/:id", deleteOne, {
        ...hook, beforeHandle: [authenticate, authorize]
    });

export default routeRouter;