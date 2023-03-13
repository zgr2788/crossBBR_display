import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {

    sessionStorage.setItem("pageArgs", "home")
    sessionStorage.setItem("filtArgs", "none")
    sessionStorage.setItem("sortArgs", "none")


    const [pageArgs, setPageArgs] = useState(sessionStorage.getItem("pageArgs"))
    const [filtArgs, setFiltArgs] = useState(sessionStorage.getItem("filtArgs"))
    const [sortArgs, setSortArgs] = useState(sessionStorage.getItem("sortArgs"))

    useEffect(() => 
        {
        sessionStorage.setItem("pageArgs", pageArgs)
        sessionStorage.setItem("filtArgs", filtArgs)
        sessionStorage.setItem("sortArgs", sortArgs)
        }, [pageArgs, filtArgs, sortArgs]
    ) 

    return (
        <UserContext.Provider value={[pageArgs, setPageArgs, filtArgs, setFiltArgs, sortArgs, setSortArgs]}>
            {props.children}
        </UserContext.Provider>
    )
};