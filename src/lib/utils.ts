export const parseTemplate = (template: string, content: any) =>
{
    const mapObj: any = {};
    for (let key of Object.keys(content))
    {
        mapObj[`#${key}`] = content[key];
    }
    const regex = RegExp(Object.keys(mapObj).join("|"), "gi");
    return template.replace(regex, (matched: string) => mapObj[matched]);
};