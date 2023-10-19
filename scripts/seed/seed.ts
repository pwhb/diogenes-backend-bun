import { Collections, dbName } from "../../src/lib/consts/db";
import clientPromise from "../../src/lib/services/mongodb";

async function seed()
{
    const client = await clientPromise;
    const col = client.db(dbName).collection(Collections.followings);
    const dbRes = await col.createIndex(
        {
            follower: 1,
            followed: 1,
        },
        { unique: true }
    );
    console.info(dbRes);

}


seed().then(() =>
{
    process.exit(0);
}).catch((error) =>
{
    console.error(error);
    process.exit(1);
});