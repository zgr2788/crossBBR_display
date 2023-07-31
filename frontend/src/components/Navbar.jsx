// Navbar

import React from "react";
import { useContext } from "react";
import { PageContext } from "../context/PageContext";

const Navbar = () => {

  const [pageArgs, setPageArgs]  = useContext(PageContext)

  const Navlink = ({text, isActive, pageArg}) => {  
    return(
      <div>
      {{  
        true : <a href="#" className="nav-link active"><p className="text-info"><strong>{ text }</strong></p></a>,
        false : <a href="#" className="nav-link" onClick={() => {setPageArgs(pageArg)}}>{ text }</a>
      }[isActive]}
      </div>
    ) 
  }

  return(
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        <span className="navbar-brand"><h1><p className="text-primary">BBB-DEX</p></h1></span>
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
                {pageArgs === "allcod" ? <Navlink text={"All Genes"} isActive={true}/> :  <Navlink text={"All Genes"} isActive={false} pageArg="allcod"/>}
              </li>
              <li className="nav-item px-5">
                {pageArgs === "methods" ? <Navlink text={"Methods"} isActive={true}/> :  <Navlink text={"Methods"} isActive={false} pageArg="methods"/>}
              </li>
              <li className="nav-item px-5">
                {pageArgs === "test" ? <Navlink text={"Support"} isActive={true}/> :  <Navlink text={"Support"} isActive={false} pageArg="test"/>}
              </li>
          </ul>
        </div>
      </div>
    </nav>
  );

}

export default Navbar;