import {Icon} from "semantic-ui-react";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {syncUser} from "../../store/actions/userActions";
import {toast} from "react-toastify";
import {handleCatch} from "../../utilities/Utils";
import CandidateService from "../../services/candidateService";

function FavoriteAdvertIcon({jobAdvert, iconSize, invisible = false, ...props}) {

    const candidateService = new CandidateService();

    const user = useSelector(state => state?.user?.userProps?.user)
    const dispatch = useDispatch();

    const jobAdvInFavorites = () => {
        const index = user.favoriteJobAdvertisements.findIndex((jobAdvertisement2) => jobAdvertisement2.id === jobAdvert.id)
        return index !== -1;
    }

    const addToFavorites = () => {
        candidateService.addJobAdvToFavorites(user.id, jobAdvert.id).then(r => {
            dispatch(syncUser(r.data.data))
            toast.error("Added to your favorites  😍")
        }).catch(handleCatch)
    }

    const removeFromFavorites = () => {
        candidateService.removeJobAdvFromFavorites(user.id, jobAdvert.id).then(r => {
            dispatch(syncUser(r.data.data))
            toast("Deleted From Favorites")
        }).catch(handleCatch)
    }

    return user?.favoriteJobAdvertisements && !invisible ?
        (jobAdvInFavorites(jobAdvert.id) ?
            <Icon name={"heart"} color={"red"} size={iconSize} {...props}
                  onClick={() => removeFromFavorites(jobAdvert.id)}/> :
            <Icon name={"heart outline"} size={iconSize} {...props}
                  onClick={() => addToFavorites(jobAdvert.id)}/>) : null
}

export default FavoriteAdvertIcon;