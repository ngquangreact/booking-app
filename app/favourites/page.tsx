import getCurrentUser from "../actions/getCurrentUser";
import getFavouriteListings from "../actions/getFavouriteListings"
import ClientOnly from "../components/ClientOnly"
import EmptyState from "../components/EmplyState"
import FavouriteClient from "./FavouriteClient";

const FavouritePage = async () => {
    const listings = await getFavouriteListings();
    const currentUser = await getCurrentUser();
    if(!currentUser) {
        return (
            <ClientOnly>
                <EmptyState
                    title="Unauthorized"
                    subtitle="Please login"
                />
            </ClientOnly>
        )
    }

    if (listings.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="No favourites found"
                    subtitle="Looks like you have no favourite listings." 
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <FavouriteClient
                listings={listings}
                currentUser={currentUser} 
            />
        </ClientOnly>
    )
}

export default FavouritePage;