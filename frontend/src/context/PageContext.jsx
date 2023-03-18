// Context for end-user

import React, { createContext, useEffect, useState } from "react";

export const PageContext = createContext();

export const PageProvider = (props) => {

    //Default is all

    sessionStorage.setItem("pageArgs", "home")

    const [pageArgs, setPageArgs] = useState(sessionStorage.getItem("pageArgs"))


    useEffect(() => 
        {
        sessionStorage.setItem("pageArgs", pageArgs)
        }, [pageArgs]
    ) 

    return (
        <PageContext.Provider value={[pageArgs, setPageArgs]}>
            {props.children}
        </PageContext.Provider>
    )
};