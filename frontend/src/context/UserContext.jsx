// Context for end-user

import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {

    sessionStorage.setItem("pageArgs", "home")
    sessionStorage.setItem("filtArgs", null)
    sessionStorage.setItem("sortArgs", null)
    sessionStorage.setItem("tableArgs", "all")


    const [pageArgs, setPageArgs] = useState(sessionStorage.getItem("pageArgs"))
    const [filtArgs, setFiltArgs] = useState(sessionStorage.getItem("filtArgs"))
    const [sortArgs, setSortArgs] = useState(sessionStorage.getItem("sortArgs"))
    const [tableArgs, setTableArgs] = useState(sessionStorage.getItem("tableArgs"))


    useEffect(() => 
        {
        sessionStorage.setItem("pageArgs", pageArgs)
        sessionStorage.setItem("filtArgs", filtArgs)
        sessionStorage.setItem("sortArgs", sortArgs)
        sessionStorage.setItem("tableArgs", tableArgs)
        }, [pageArgs, filtArgs, sortArgs, tableArgs]
    ) 

    return (
        <UserContext.Provider value={[pageArgs, setPageArgs, filtArgs, setFiltArgs, sortArgs, setSortArgs, tableArgs, setTableArgs]}>
            {props.children}
        </UserContext.Provider>
    )
};