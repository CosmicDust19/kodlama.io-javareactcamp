import React, {useEffect, useState} from "react";
import SignedIn from "./SignedIn"
import SignedOut from "./SignedOut"
import {useSelector} from "react-redux";

export default function Navi() {

    const userProps = useSelector(state => state?.user?.userProps)

    useSelector(state => state?.user?.userProps?.user)

    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        if (userProps.loggedIn)
            setIsAuthenticated(true)
        else setIsAuthenticated(false)
    }, [userProps.loggedIn]);

    return (
        <div className={"navi"}>
            {isAuthenticated ?
                <SignedIn/> :
                <SignedOut/>}
        </div>
    );
}