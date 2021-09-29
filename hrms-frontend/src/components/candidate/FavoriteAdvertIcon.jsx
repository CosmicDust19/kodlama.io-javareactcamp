import {Icon, Transition} from "semantic-ui-react";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {syncUser} from "../../store/actions/userActions";
import {toast} from "react-toastify";
import {handleCatch} from "../../utilities/Utils";
import CandidateService from "../../services/candidateService";

function FavoriteAdvertIcon({jobAdvert, iconSize, invisible = false, ...props}) {

    const candidateService = new CandidateService();

    const user = useSelector(state => state?.user?.userProps?.user)
    const dispatch = useDispatch();

    const inFavorites = user?.favoriteJobAdvertisements?.findIndex((favJobAdvert) => favJobAdvert.id === jobAdvert.id) !== -1;

    const [redVisible, setRedVisible] = useState(inFavorites);
    const [outlineVisible, setOutlineVisible] = useState(!inFavorites);

    if (!user || !user.favoriteJobAdvertisements) return null

    const toggleVisible = () => {
        setRedVisible(inFavorites)
        setOutlineVisible(!inFavorites)
    }

    const addToFavorites = () => {
        candidateService.addJobAdvToFavorites(user.id, jobAdvert.id).then(r => {
            dispatch(syncUser(r.data.data, true))
            toast.error("Added to your favorites  😍")
        }).catch(handleCatch)
    }

    const removeFromFavorites = () => {
        candidateService.removeJobAdvFromFavorites(user.id, jobAdvert.id).then(r => {
            dispatch(syncUser(r.data.data, true))
            toast("Deleted From Favorites")
        }).catch(handleCatch)
    }

    return user.favoriteJobAdvertisements && !invisible ?
        <div style={{float: "right"}}>
            <Transition visible={inFavorites && redVisible} duration={150} onHide={toggleVisible} animation={"drop"}>
                <Icon name={"heart"} color={"red"} size={iconSize} {...props}
                      onClick={() => removeFromFavorites(jobAdvert.id)}/>
            </Transition>
            <Transition visible={!inFavorites && outlineVisible} duration={150} onHide={toggleVisible} animation={"drop"}>
                <Icon name={"heart outline"} size={iconSize} {...props}
                      onClick={() => addToFavorites(jobAdvert.id)}/>
            </Transition>
        </div> : null

}

export default FavoriteAdvertIcon;