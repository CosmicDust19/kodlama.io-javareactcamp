export const LOGIN = "LOGIN"
export const SIGN_OUT = "SIGN_OUT"

export function login(user, userType) {
    return {
        type: LOGIN,
        payload: {user, userType}
    }
}

export function signOut() {
    return {
        type: SIGN_OUT
    }
}