import { exists, unlinkSync } from "fs";
import { config } from "./consts";




function remove(path: string)
{
    try
    {
        unlinkSync(path);
    } catch (e)
    {
        console.error(`${path} does not exist`);
    }
}
async function main()
{
    try
    {
        const collectionName = Bun.argv[2];
        if (!collectionName)
        {
            console.error("No collection name specified.\nPlease specify a collection name: bun run add users");
            return;
        }
        remove(`${config.controllerDir}/${collectionName}.ts`);
        remove(`${config.routerDir}/${collectionName}.ts`);
        remove(`${config.restDir}/${collectionName}.rest`);

    } catch (error)
    {
        console.error(error);
    }
}

main().then(() =>
{
    process.exit(0);
}).catch((error) =>
{
    console.error(error);
    process.exit(1);
});