import Elysia from "elysia";
import { home } from "../controllers";
import Tags from "../lib/consts/tags";

const hook = { detail: { tags: [Tags.app] } };

const indexRouter = new Elysia()
    .get("/", home, hook);

export default indexRouter;