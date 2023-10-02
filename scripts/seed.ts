import { Collections, dbName } from "../src/lib/consts/db";
import clientPromise from "../src/lib/mongodb";

async function seed()
{
    const client = await clientPromise;
    const col = client.db(dbName).collection(Collections.configs);
    await col.createIndex(
        {
            "name": 1
        },
        {
            unique: true,
        }
    );

}


seed().then(() =>
{
    process.exit(0);
}).catch((error) =>
{
    console.error(error);
    process.exit(1);
});