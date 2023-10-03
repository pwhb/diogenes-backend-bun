import { Collections, dbName } from "../src/lib/consts/db";
import clientPromise from "../src/lib/mongodb";

async function seed()
{
    const client = await clientPromise;
    const col = client.db(dbName).collection(Collections.routes);
    const dbRes = await col.createIndex(
        {
            "path": 1,
            "entity": 1,
            "method": 1
        },
        { unique: true }
    );
    console.log(dbRes);

}


seed().then(() =>
{
    process.exit(0);
}).catch((error) =>
{
    console.error(error);
    process.exit(1);
});