import { exists, unlinkSync } from "fs";
import { config, elements } from "./consts";




export function remove(path: string)
{
    try
    {
        unlinkSync(path);
        console.log(`removed ${path}`);

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

        for (let el of elements)
        {
            const obj: any = (config as any)[el];
            remove(`${obj.dir}/${collectionName}${obj.extension}`);
        }


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