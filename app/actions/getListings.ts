import prisma from "@/app/libs/prismadb";

export interface IListingParams {
    userId?: string;
    guestCount?: number;
    roomCount?: number;
    bathroomCount?: number;
    startDate?: string;
    endDate?: string;
    locationValue?: string;
    category?: string;
}

export default async function getListings(
    params: IListingParams
) {
    try {
        const { 
            userId,
            guestCount,
            roomCount,
            bathroomCount,
            startDate,
            endDate,
            locationValue,
            category
        } = params;

        let query: any = {};
        // for string
        if (userId) {
            query.userId = userId;
        }
        if (category) {
            query.category = category;
        }
        if (locationValue) {
            query.locationValue = locationValue;
        }
        // for number
        if (guestCount) {
            query.guestCount = {
                gte: +guestCount
            }
        }
        if (roomCount) {
            query.roomCount = {
                gte: +roomCount
            }
        }
        if (bathroomCount) {
            query.bathroomCount = {
                gte: +bathroomCount
            }
        }
        if (startDate && endDate) {
            query.NOT = {
                reservations: {
                    some: {
                        OR: [
                            {
                                endDate: {gte: startDate},
                                startDate: {lte: endDate},
                            },
                            {
                                startDate: {lte: endDate},
                                endDate: {gte: startDate},
                            }
                        ]
                    }
                }
            }
        }

        const listings = await prisma.listing.findMany({
            where: query,
            orderBy: {
                createdAt: 'desc'
            }
        })
        const safeListings = listings.map((item) => ({
            ...item,
            createdAt: item.createdAt.toISOString()
        }))
        return safeListings;
    } catch (error: any) {
        throw new Error(error)
    }
}