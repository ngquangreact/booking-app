import { useCallback, useMemo } from "react";
import { SafeUser } from "../types";
import useLoginModal from "./useLoginModal";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface IUserFavourite {
    listingId: string;
    currentUser?: SafeUser | null;
}

const useFavourite = ({listingId, currentUser}: IUserFavourite) => {
    const loginModal = useLoginModal();
    const route = useRouter();

    const hasFavourited = useMemo(() => {
        const listFavourite = currentUser?.favouriteIds || [];

        return listFavourite.includes(listingId);
    },[listingId,currentUser]);

    const toggleFavourite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!currentUser) {
            return loginModal.onOpen();
        }

        try {
            let request;
            const url = `/api/favourites/${listingId}`;
            if (hasFavourited) {
                request = () => axios.delete(url);
            } else {
                request = () => axios.post(url);
            }
    
            await request();
            route.refresh();
            toast.success('Success');
        } catch(error) {
            toast.error('Something went wrong!');
        }
    },[listingId,currentUser,hasFavourited,route,loginModal]);

    return {hasFavourited,toggleFavourite};
}

export default useFavourite;
