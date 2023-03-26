// Context for end-user

import React, { createContext, useEffect, useState } from "react";

export const TableContext = createContext();

export const TableProvider = (props) => {
    
    // Declare defaults
    
    sessionStorage.setItem("tableArgs", "all")

    const [loading, setLoading] = useState(false)
    const [tableArgs, settableArgs] = useState(sessionStorage.getItem("tableArgs"))


    useEffect(() => 
        {
        sessionStorage.setItem("tableArgs", tableArgs)
        }, [tableArgs]
    ) 

    return (
        <TableContext.Provider value={[loading, setLoading, tableArgs, settableArgs]}>
            {props.children}
        </TableContext.Provider>
    )
};