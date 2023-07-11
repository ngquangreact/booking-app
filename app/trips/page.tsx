import EmptyState from "../components/EmplyState";
import ClientOnly from "../components/ClientOnly";
import TripsClient from "./TripsClient";

import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";

const TripsPage = async () => {
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

    const reservations = await getReservations({
        userId: currentUser.id
    })

    if (reservations.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="No trips found"
                    subtitle="Look like you have'nt reserved any trips." 
                />
            </ClientOnly>
        )
    } else {
        return (
            <ClientOnly>
                <TripsClient
                    reservations={reservations}
                    currentUser={currentUser} 
                />
            </ClientOnly>
        )
    }
}

export default TripsPage;