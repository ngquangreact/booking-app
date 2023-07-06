import prisma from "@/app/libs/prismadb";

interface IParams {
    listingId?: string
}

export default async function getListingById(
    params: IParams
) {
    try {
        // take argument
        const { listingId } = params;
        // find collection in database by argument
        const listing = await prisma.listing.findUnique({
            where: {
                id: listingId
            },
            include: {
                user: true
            }
        });
        // return
        if (!listing) {
            return null;
        }
        
        return {
            ...listing,
            createdAt: listing.createdAt.toISOString,
            user: {
                ...listing.user,
                createdAt: listing.user.createdAt.toISOString(),
                updatedAt: listing.user.updatedAt.toISOString(),
                emailVerified: listing.user.emailVerified?.toISOString() || null,
            }
        }
    } catch (error: any) {
        throw new Error(error)
    }
}