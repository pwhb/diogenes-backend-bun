import Elysia from "elysia";
import Tags from "../lib/consts/tags";
import { setup } from "../lib/config/plugins";
import { dbName, Collections } from "../lib/consts/db";
import clientPromise from "../lib/services/mongodb";
import WsKeys from "../lib/consts/WsKeys";

const hook = { detail: { tags: [Tags.users] } };

const wsRouter = new Elysia()
    .use(setup)
    .ws("/ws", {
        open(ws)
        {
            console.log("open", ws.data.cookie);
        },
        close(ws)
        {
            console.log("close");

        },
        message(ws, message: any)
        {
            switch (message.type)
            {
                case WsKeys.join: {
                    for (let room of message.rooms)
                    {
                        ws.subscribe(room);
                        ws.send(`joined ${room}`);
                    }
                }
                default: {
                    const obj = {
                        userId: ws.data.cookie.userId,
                        ...message
                    };

                    ws.publish(message.roomId, obj);
                }
            }

        },
        async beforeHandle({ jwt, query, set, setCookie })
        {
            const { token } = query as any;
            const { username } = await jwt.verify(token) as any;
            if (!username)
            {
                set.status = 401;
                return "Invalid Bearer Token";
            }
            const client = await clientPromise;
            const col = client.db(dbName).collection(Collections.users);
            const user = await col.findOne({ username }) as any;
            setCookie("userId", user._id);
        }
    });

export default wsRouter;

