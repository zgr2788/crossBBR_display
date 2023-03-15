// Navbar

import React from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Navbar = () => {

  const [pageArgs, setPageArgs]  = useContext(UserContext)

  const Navlink = ({text, isActive, pageArg}) => {  
    return(
      <div>
      {{  
        true : <button className="nav-link active"><p className="text-info"><strong>{ text }</strong></p></button>,
        false : <button className="nav-link" onClick={() => {setPageArgs(pageArg)}}>{ text }</button>
      }[isActive]}
      </div>
    ) 
  }

  return(
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        <span className="navbar-brand"><h1><p className="text-primary">BBB Data Repository</p></h1></span>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav me-auto container-fluid d-flex justify-content-evenly">
              <li className="nav-item px-5">
                {pageArgs === "home" ? <Navlink text={"Homepage"} isActive={true}/> :  <Navlink text={"Homepage"} isActive={false} pageArg="home"/>}
              </li>
              <li className="nav-item px-5">
                {pageArgs === "trmemfoc" ? <Navlink text={"Transmembrane Focus"} isActive={true}/> :  <Navlink text={"Transmembrane Focus"} isActive={false} pageArg="trmemfoc"/>}
              </li>
              <li className="nav-item px-5">
                {pageArgs === "allcod" ? <Navlink text={"All Coding Genes"} isActive={true}/> :  <Navlink text={"All Coding Genes"} isActive={false} pageArg="allcod"/>}
              </li>
              <li className="nav-item px-5">
                {pageArgs === "downloads" ? <Navlink text={"Downloads"} isActive={true}/> :  <Navlink text={"Downloads"} isActive={false} pageArg="downloads"/>}
              </li>
          </ul>
        </div>
      </div>
    </nav>
  );

}

export default Navbar;