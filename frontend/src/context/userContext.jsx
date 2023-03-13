import React, { createContext, useEffect, useState } from "react";

export const userContext = createContext();

export const userProvider = (props) => {
    const [page, setPageArgs] = useState(sessionStorage.getItem("pageArgs"))
    const [filt, setFiltArgs] = useState(sessionStorage.getItem("filtArgs"))
    const [sort, setSortArgs] = useState(sessionStorage.getItem("sortArgs"))


    return (
        <userContext.Provider value={[pageArgs, setPage, filtArgs, setFilt, sortArgs, setSort, rem, setRem, alloc, setAlloc]}>
            {props.children}
        </userContext.Provider>
    )
};