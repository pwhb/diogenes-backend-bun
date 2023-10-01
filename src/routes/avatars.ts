import Elysia from "elysia";
import { getMany } from "../controllers/avatars";

const avatarRouter = new Elysia({ prefix: "/avatars" })
    .get("/", getMany);

export default avatarRouter;