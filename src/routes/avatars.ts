import Elysia from "elysia";
import { getMany } from "../controllers/avatars";
import { Collections } from "../lib/consts/db";
import Tags from "../lib/consts/tags";

const hook = { detail: { tags: [Tags.roles] } };

const avatarRouter = new Elysia({ prefix: `/${Collections.avatars}` })
    .get("/", getMany, hook);

export default avatarRouter;