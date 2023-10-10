import { ObjectId } from "mongodb";

export const create = ({ request, body }: any) =>
{
    (body as any).active = false;
    if ((request as any).user)
    {
        (body as any).createdBy = new ObjectId((request as any).user._id);
    }
    (body as any).createdAt = new Date();
    (body as any).updatedBy = new ObjectId((request as any).user._id);
    (body as any).updatedAt = new Date();
};

export const update = ({ request, body }: any) =>
{
    (body as any).updatedBy = new ObjectId((request as any).user._id);
    (body as any).updatedAt = new Date();
};