import Elysia from "elysia";
import { home } from "../controllers";

const indexRouter = new Elysia({ prefix: "/" })
    .get("/", home);

export default indexRouter;