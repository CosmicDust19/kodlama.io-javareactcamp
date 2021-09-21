import {toast} from "react-toastify";
import {syncUser} from "../store/actions/userActions";

export const getAge = (birthYear) => birthYear ? new Date().getFullYear() - birthYear : null

export const cropImgByDynamicUrl = (img) => {
    const horizontalImg = img.width > img.height
    const cropSquareEdge = horizontalImg ? img.height : img.width
    let sliced = img.imageUrl.split("/upload/")
    const right = `c_crop,h_${cropSquareEdge},w_${cropSquareEdge}/${sliced[1]}`
    const left = sliced[0]
    return `${left}/upload/${right}`
}

export const onUpdate = (dispatch, response, msg) => {
    dispatch(syncUser(response.data.data, true));
    toast(msg);
}