import {toast} from "react-toastify";
import {handleCatch} from "./Utils";
import UserService from "../services/userService";
import {changeEmail, signOut, syncUser} from "../store/actions/userActions";

const userService = new UserService()

export const getImgUrl = (imgId, userImages) => {
    const imgIndex = userImages.findIndex(img => img.id === imgId)
    return userImages[imgIndex].imageUrl
}

export const getProfileImgSrc = (user, defImg) => user.profileImgId ? getImgUrl(user.profileImgId, user.images) : defImg

export const onUpdate = (dispatch, response, msg) => {
    dispatch(syncUser(response.data.data));
    toast(msg);
}

export const updateEmail = (dispatch, user, email) => {
    userService.updateEmail(user.id, email)
        .then(r => {
            dispatch(changeEmail(r.data.data.email))
            toast("Saved")
        })
        .catch(handleCatch)
}

export const checkCurrentPassword = (user, formik, setAuthenticated) => {
    userService.existsByEmailAndPW(user.email, formik.values.currentPassword)
        .then(r => {
            if (r.data.data === true) {
                setAuthenticated(true)
                toast("Authentication Successful")
            } else toast.warning("Wrong password");
        })
        .catch(handleCatch)
}

export const updatePassword = (userId, formik) => {
    userService.updatePassword(userId, formik.values.password, formik.values.currentPassword)
        .then(r => {
            toast("Saved")
            formik.values.currentPassword = formik.values.password
            formik.setFieldValue("currentPassword", formik.values.password)
        })
        .catch(handleCatch)
}

export const deleteAccount = (dispatch, userId, history, setDeletePopupOpen) => {
    userService.deleteById(userId)
        .then(() => {
            dispatch(signOut())
            history.push("/")
            toast("Good Bye 👋")
        })
        .catch(handleCatch)
        .finally(() => setDeletePopupOpen(false))
}