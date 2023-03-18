// Context for end-user

import React, { createContext, useEffect, useState } from "react";

export const TableContext = createContext();

export const TableProvider = (props) => {

    //Default is all
    
    sessionStorage.setItem("filtArgs",   JSON.stringify({
        Rank_p__val : true,
        Mean_Perfusion_Score : true,
        DESeq2_Appeared : true,
        DESeq2_Validated : true,
        Wilcox_Appeared : true,
        Wilcox_Validated : true,
        Prot_Evidence : true,
        Actions : true
      }))
    
    sessionStorage.setItem("sortArgs", null)
    
    sessionStorage.setItem("tableArgs", "all")


    const [filtArgs, setFiltArgs] = useState(sessionStorage.getItem("filtArgs"))
    const [sortArgs, setSortArgs] = useState(sessionStorage.getItem("sortArgs"))
    const [tableArgs, setTableArgs] = useState(sessionStorage.getItem("tableArgs"))
    const [loading, setLoading] = useState(false)


    useEffect(() => 
        {
        sessionStorage.setItem("filtArgs", filtArgs)
        sessionStorage.setItem("sortArgs", sortArgs)
        sessionStorage.setItem("tableArgs", tableArgs)
        }, [filtArgs, sortArgs, tableArgs]
    ) 

    return (
        <TableContext.Provider value={[filtArgs, setFiltArgs, sortArgs, setSortArgs, tableArgs, setTableArgs, loading, setLoading]}>
            {props.children}
        </TableContext.Provider>
    )
};