import { dbName, Collections } from "../lib/consts/db";
import clientPromise from "../lib/mongodb";

export const authenticate = async ({ bearer, set, jwt, request }: any) =>
{
    try
    {
        if (!bearer)
        {
            set.status = 401;
            return "No Bearer Token";
        }
        const { username } = await jwt.verify(bearer) as any;
        if (!username)
        {
            set.status = 401;
            return "Invalid Bearer Token";
        }
        const client = await clientPromise;
        const col = client.db(dbName).collection(Collections.users);
        const user = await col.findOne({ username });
        if (!user)
        {
            set.status = 401;
            return "User Not Found";
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
        console.log(request.user);

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

        console.log({ path, method });


        const client = await clientPromise;
        const col = client.db(dbName).collection(Collections.routes);


        const route = await col.findOne({ path, method });
        const access = route ? route.access : defaultAccess;

        console.log({ access, role });

        if (!route)
        {
            await col.insertOne({ path, entity, method, access });
        }

        if (!access.includes(role))
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
