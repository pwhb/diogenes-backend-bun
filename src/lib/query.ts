import { Filter, ObjectId, Sort } from "mongodb";

export enum Types
{
    String,
    Boolean,
    ObjectId,
    DateBefore,
    DateAfter,
    Regex
}

export interface Key
{
    key: string;
    type: Types;
    field?: string;
    searchedKeys?: string[];
}

interface IQueryInput
{
    filter: Filter<any>;
    keys: Key[];
    query: Record<string, string | null>;
    sort?: any;
}

export function parseSort(query: Record<string, string | null>)
{
    const sort: Sort = {};
    if (query["sort_by"])
    {
        const split = query["sort_by"].split(",");
        for (let key of split)
        {
            const trimmed = key.trim();
            const field = trimmed.replace("-", "");
            sort[field] = trimmed[0] === "-" ? -1 : 1;
        }
    } else
    {
        sort["createdAt"] = -1;
    }
    return sort;
}
export function parseQuery({ keys, filter, query, sort }: IQueryInput)
{
    const or: Filter<any>[] = [];
    const and: Filter<any>[] = [];
    for (let key of keys)
    {
        if (query[key.key])
        {
            switch (key.type)
            {
                case Types.String: {
                    filter[key.field ? key.field : key.key] = query[key.key];
                    break;
                }
                case Types.Boolean: {
                    filter[key.field ? key.field : key.key] = query[key.key] === "true";
                    break;
                }
                case Types.ObjectId: {
                    filter[key.field ? key.field : key.key] = new ObjectId(query[key.key] as string);
                    break;
                }
                case Types.DateAfter: {
                    and.push({
                        [key.field ? key.field : key.key]: { $gte: new Date(query[key.key] as string) }
                    });
                    break;
                }
                case Types.DateBefore: {
                    and.push({
                        [key.field ? key.field : key.key]: { $lt: new Date(query[key.key] as string) }
                    });
                    break;
                } case Types.Regex: {
                    if (key.searchedKeys)
                    {
                        for (let searchedKey of key.searchedKeys)
                        {
                            or.push({
                                [searchedKey]: { $regex: query[key.key], $options: "i" }
                            });
                        }
                    }
                    break;
                }
            }
        }
    }
    if (and.length && or.length)
    {
        filter["$and"] = [...and, { "$or": or }];
    } else if (or.length)
    {
        filter["$or"] = or;
    } else if (and.length)
    {
        filter["$and"] = and;
    }

}