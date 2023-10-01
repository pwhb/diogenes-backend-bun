import Elysia from "elysia";
import { getMany } from "../controllers/avatars";
import { Collections } from "../lib/consts/db";

const avatarRouter = new Elysia({ prefix: `/${Collections.avatars}` })
    .get("/", getMany);

export default avatarRouter;