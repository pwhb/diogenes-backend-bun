import Elysia from "elysia";

import { setup } from "../lib/config/plugins";
import Tags from "../lib/consts/tags";
import { authenticate } from "../middlewares/auth";
import { getPermissionByRole } from "../controllers/routes";

const hook = { detail: { tags: [Tags.roles] } };

const permissionRouter = new Elysia({ prefix: `/permissions` })
    .use(setup)
    .get("/", getPermissionByRole, {
        ...hook,
        beforeHandle: [authenticate]
    });

export default permissionRouter;