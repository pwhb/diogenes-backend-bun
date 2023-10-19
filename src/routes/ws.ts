import Elysia from "elysia";
import Tags from "../lib/consts/tags";
import { setup } from "../lib/config/plugins";
import { dbName, Collections } from "../lib/consts/db";
import clientPromise from "../lib/services/mongodb";
import WsKeys from "../lib/consts/WsKeys";
import { Filter, ObjectId, UpdateFilter } from "mongodb";
import { MessageStatus } from "../lib/consts/message";

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
        async message(ws, message: any)
        {
            switch (message.type)
            {
                case WsKeys.join: {
                    for (let room of message.rooms)
                    {
                        ws.subscribe(room);
                        ws.publish(room, {
                            type: WsKeys.join,
                            data: {
                                message: `${ws.data.cookie.userId} joined ${room}`
                            }
                        });
                    }
                    break;
                }
                case WsKeys.message: {
                    const roomId = message.data.roomId;
                    const doc = {
                        ...message.data,
                        roomId: new ObjectId(roomId),
                        senderId: new ObjectId(ws.data.cookie.userId as any),
                        createdAt: new Date(),
                        status: MessageStatus.sent,
                        seen: []
                    };

                    const client = await clientPromise;
                    const dbRes = await client.db(dbName).collection(Collections.messages).insertOne(doc);
                    const data = {
                        type: WsKeys.message,
                        data: {
                            _id: dbRes.insertedId,
                            ...doc
                        }
                    };
                    ws.publish(roomId, data);
                    ws.send(data);
                    break;
                }

                case WsKeys.status: {
                    const { messageId, status } = message.data;
                    const client = await clientPromise;

                    const filter: Filter<any> = { _id: new ObjectId(messageId) };
                    const update: UpdateFilter<any> = {
                        $set: {
                            status: status,
                        },
                    };

                    if (status === MessageStatus.seen)
                    {
                        filter["seen"] = { $ne: new ObjectId(ws.data.cookie.userId as any) };
                        update["$push"] = { seen: new ObjectId(ws.data.cookie.userId as any) as any };
                    }
                    const dbRes = await client.db(dbName).collection(Collections.messages).findOneAndUpdate(filter, update, { returnDocument: "after" }) as any;
                    const data = {
                        type: WsKeys.status,
                        data: dbRes || {
                            _id: messageId,
                            status: status
                        }
                    };
                    ws.publish(message.data.roomId, data);
                    break;
                }

                case WsKeys.typing: {
                    const { roomId, status } = message.data;
                    ws.publish(roomId, {
                        type: WsKeys.typing,
                        data: {
                            senderId: ws.data.cookie.userId,
                            status: status
                        }
                    });
                    break;
                }
                default: {
                    // const obj = {
                    //     userId: ws.data.cookie.userId,
                    //     ...message
                    // };
                    console.log("default", message);

                    // ws.publish(message.roomId, obj);
                }
            }

        },
        async beforeHandle({ jwt, query, set, setCookie })
        {
            const { token } = query as any;
            const { _id } = await jwt.verify(token) as any;
            if (!_id)
            {
                set.status = 401;
                return "Invalid Bearer Token";
            }
            const client = await clientPromise;
            const col = client.db(dbName).collection(Collections.users);
            const user = await col.findOne({ _id: new ObjectId(_id) }, {
                projection: {
                    password: 0
                }
            }) as any;
            console.log("user", user);
            setCookie("userId", user._id);
        }
    });

export default wsRouter;

