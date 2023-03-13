import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {

    useEffect(() => 
        {

        sessionStorage.setItem("pageArgs", "home")

        }
    ) 

    const [pageArgs, setPageArgs] = useState(sessionStorage.getItem("pageArgs"))
    const [filtArgs, setFiltArgs] = useState(sessionStorage.getItem("filtArgs"))
    const [sortArgs, setSortArgs] = useState(sessionStorage.getItem("sortArgs"))


    return (
        <UserContext.Provider value={[pageArgs, setPageArgs, filtArgs, setFiltArgs, sortArgs, setSortArgs]}>
            {props.children}
        </UserContext.Provider>
    )
};