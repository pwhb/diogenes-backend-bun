import { ObjectId } from "mongodb";
import { dbName, Collections } from "../lib/consts/db";
import clientPromise from "../lib/services/mongodb";

export const authenticate = async ({ bearer, set, jwt, cookie, request }: any) =>
{
    try
    {
        if (!bearer)
        {
            set.status = 401;
            return "No Bearer Token";
        }
        const { _id } = await jwt.verify(bearer) as any;
        if (!_id)
        {
            set.status = 401;
            return "Invalid Bearer Token";
        }
        const client = await clientPromise;
        const col = client.db(dbName).collection(Collections.users);
        const user = await col.findOne({ _id: new ObjectId(_id) });
        if (!user)
        {
            set.status = 401;
            return "User Not Found";
        }

        if (!user.active)
        {
            set.status = 401;
            return "Deactivated User";
        }
        (request as any).user = user;
    } catch (error)
    {
        console.error(error);
        return "Server Error";
    }
};

const defaultAccess = ["root"];

export const authorize = async ({ request, set }: any) =>
{

    try
    {
        if (!request.user)
        {
            set.status = 401;
            return "Unauthenticated";
        }
        const role = request.user.role;

        if (!role)
        {
            set.status = 403;
            return "Unauthorized";
        }

        const method = request.method;
        const [_, pathname] = request.url.split("api/v1/");
        const [entity, id] = pathname.split("/");
        const path = `${entity}${id ? "/:id" : ""}`;

        const client = await clientPromise;
        const col = client.db(dbName).collection(Collections.routes);

        const route = await col.findOne({ path, method });
        const access = route ? route.access : defaultAccess;

        if (!route)
        {
            await col.insertOne({ path, entity, method, access });
        }

        if (!access.includes("all") && !access.includes(role))
        {
            set.status = 403;
            return { message: "Insufficient permissions" };
        }
    } catch (error)
    {
        console.error(error);
        return "Server Error";
    }

};

export const authorizeSelf = async ({ request, set, params }: any) =>
{

    try
    {
        if (!request.user)
        {
            set.status = 401;
            return "Unauthenticated";
        }

        if (params.id !== request.user._id)
        {
            set.status = 403;
            return "Unauthorized";
        }
    } catch (error)
    {
        console.error(error);
        return "Server Error";
    }

};

