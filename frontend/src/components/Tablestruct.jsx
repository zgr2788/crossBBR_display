// General table struct, includes table functionalities

import React from "react";
import { useContext } from "react";
import { TableContext } from "../context/TableContext";
import './Fade.css'
import Genetable from "./Genetable";
import Sortmenu from "./Sortmenu";

const TableStruct = () => {


  const [,setFiltArgs,,setSortArgs,tableArgs,setTableArgs,,setLoading,,setNextPrio] = useContext(TableContext)

  const changeTable = (tableName) => {
    setLoading(false)
    setTableArgs(tableName)
    setNextPrio([7,6,5,4,3,2,1])
    

    if (tableName === "all") {
      setFiltArgs(
        JSON.stringify({
          Rank_p__val : true,
          Mean_Perfusion_Score : true,
          DESeq2_Appeared : true,
          DESeq2_Validated : true,
          Wilcox_Appeared : true,
          Wilcox_Validated : true,
          Prot_Evidence : true,
          Actions : true
        })
      )

      setSortArgs(
        JSON.stringify({
          Rank_p__val_s : -1,
          Mean_Perfusion_Score_s : -1,
          DESeq2_Appeared_s : -1,
          DESeq2_Validated_s : -1,
          Wilcox_Appeared_s : -1,
          Wilcox_Validated_s : -1,
          Prot_Evidence_s : -1,
        })
      )
    } else {

      setFiltArgs(
        JSON.stringify({
          Rank_p__val : true,
          Mean_Perfusion_Score : true,
          Validated : true,
          Actions : true
        })
      )

      setSortArgs(
        JSON.stringify({
          Rank_p__val_s : -1,
          Mean_Perfusion_Score_s : -1,
          Validated_s : -1,
        })
      )
    }
  }

  const TabPanel = () => {
    return(
      <ul className="nav nav-tabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button className={tableArgs === "all" ? "nav-link text-warning active" : "nav-link text-warning"} onClick={() => {tableArgs !== "all" && changeTable("all")}}><strong>All</strong></button>
          </li>
          <li className="nav-item" role="presentation">
            <button className={tableArgs === "deseq2" ? "nav-link text-warning active" : "nav-link text-warning"} onClick={() => {tableArgs !== "deseq2" && changeTable("deseq2")}}><strong>DESeq2</strong></button>
          </li>
          <li className="nav-item" role="presentation">
            <button className={tableArgs === "deseq2valid" ? "nav-link text-warning active" : "nav-link text-warning"} onClick={() => {tableArgs !== "deseq2valid" && changeTable("deseq2valid")}}><strong>DESeq2 Validation</strong></button>
          </li>
          <li className="nav-item" role="presentation">
            <button className={tableArgs === "wilcox" ? "nav-link text-warning active" : "nav-link text-warning"} onClick={() => {tableArgs !== "wilcox" && changeTable("wilcox")}}><strong>Wilcox</strong></button>
          </li>
          <li className="nav-item" role="presentation">
            <button className={tableArgs === "wilcoxvalid" ? "nav-link text-warning active" : "nav-link text-warning"} onClick={() => {tableArgs !== "wilcoxvalid" && changeTable("wilcoxvalid")}}><strong>Wilcox Validation</strong></button>
          </li>
      </ul>
    )
  };

  return(
    <>
        <div className="row">
          <TabPanel />
        </div>

        <br />

        <div className="row">
          <Sortmenu />
        </div>

        <br />

        <div className="row">
          <Genetable /> 
        </div>
    </>
    
  );

}

export default TableStruct;