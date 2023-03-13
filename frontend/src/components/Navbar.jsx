import React from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Navbar = () => {

  const [pageArgs, setPageArgs, filtArgs, setFiltArgs, sortArgs, setSortArgs]  = useContext(UserContext)

  const Navlink = ({text, isActive, pageArg}) => {  
        if (isActive) {
          return <button class="nav-link active"><p class="text-info">{ text }</p></button>
        }
        return <button class="nav-link" onClick={() => {setPageArgs(pageArg)}}>{ text }</button>
      }

  return(
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
    <div class="container-fluid">
      <a class="navbar-brand" href=""><h1><p class="text-primary">BBB Data Repository</p></h1></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarColor01">
        <ul class="navbar-nav me-auto">
          <li class="nav-item px-5">
            {pageArgs == "home" ? <Navlink text={"Homepage"} isActive={true}/> :  <Navlink text={"Homepage"} isActive={false} pageArg="home"/>}
          </li>
          <li class="nav-item px-5">
            {pageArgs == "trmemfoc" ? <Navlink text={"Transmembrane Focus"} isActive={true}/> :  <Navlink text={"Transmembrane Focus"} isActive={false} pageArg="trmemfoc"/>}
          </li>
          <li class="nav-item px-5">
            {pageArgs == "allcod" ? <Navlink text={"All Coding Genes"} isActive={true}/> :  <Navlink text={"All Coding Genes"} isActive={false} pageArg="allcod"/>}
          </li>
          <li class="nav-item px-5">
            {pageArgs == "downloads" ? <Navlink text={"Downloads"} isActive={true}/> :  <Navlink text={"Downloads"} isActive={false} pageArg="downloads"/>}
          </li>
        </ul>
      </div>
    </div>
  </nav>
  );

}

export default Navbar;