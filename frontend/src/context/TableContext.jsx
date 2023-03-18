// Context for end-user

import React, { createContext, useEffect, useState } from "react";

export const TableContext = createContext();

export const TableProvider = (props) => {

    
    sessionStorage.setItem("filtArgs",   JSON.stringify({
        Rank_p__val_f : true,
        Mean_Perfusion_Score_f : true,
        DESeq2_Appeared_f : true,
        DESeq2_Validated_f : true,
        Wilcox_Appeared_f : true,
        Wilcox_Validated_f : true,
        Prot_Evidence_f : true,
        Actions_f : true
      }))
    
    sessionStorage.setItem("sortArgs", JSON.stringify({
        "Score" : -1,
        "Mean Perfusion Score" : -1,
        DESeq2_Appeared : -1,
        DESeq2_Validated : -1,
        Wilcox_Appeared : -1,
        Wilcox_Validated : -1,
        Prot_Evidence : -1,
      }))
    
    sessionStorage.setItem("tableArgs", "all")


    const [filtArgs, setFiltArgs] = useState(sessionStorage.getItem("filtArgs"))
    const [sortArgs, setSortArgs] = useState(sessionStorage.getItem("sortArgs"))
    const [tableArgs, setTableArgs] = useState(sessionStorage.getItem("tableArgs"))
    const [loading, setLoading] = useState(false)
    const [nextPrio, setNextPrio] = useState([7,6,5,4,3,2,1]) 


    useEffect(() => 
        {
        sessionStorage.setItem("filtArgs", filtArgs)
        sessionStorage.setItem("sortArgs", sortArgs)
        sessionStorage.setItem("tableArgs", tableArgs)
        }, [filtArgs, sortArgs, tableArgs]
    ) 

    return (
        <TableContext.Provider value={[filtArgs, setFiltArgs, sortArgs, setSortArgs, tableArgs, setTableArgs, loading, setLoading, nextPrio, setNextPrio]}>
            {props.children}
        </TableContext.Provider>
    )
};