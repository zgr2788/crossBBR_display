// Transmembrane focused tables page

import {React} from "react";
import { TableProvider } from "../context/TableContext";
import Aggtable from "./Aggtable";
import './Fade.css'
import Footer from "./Footer";


const Transmemfoc = () => {

  return(
    <div className="fadeIn mx-4">
      <br />
      <div className="container-fluid">
        <div className="row pt-2">
          <h1 className="px-2">Transmembrane Focus</h1>
        </div>


        <div className="row pt-4">
          <h3 className="text-muted">Help</h3>
          <p>
            This section includes further analyses conducted for genes with transmembrane helices, particularly Robust Rank Aggregation (RRA).
            For more information on how the columns are calculated, refer to the <i><b>Methods</b></i> tab. 
            <br />
            <i><b className="text-info">Click on the significance value of a gene to view its normalized count distribution across samples.</b></i>
          </p>
        </div>

        


        <div className="row pt-4">
          <h3 className="text-muted">Columns</h3>
            <ul>
              <li className="mx-3">
                <strong>Gene ID:</strong> Ensembl gene ID for the given gene.
              </li>
              <li className="mx-3">
                <strong>Gene Name:</strong> Matched HGNC symbol for the given ID.
              </li>
              <li className="mx-3">
                <strong>Uniprot ID:</strong> Matched Uniprot ID for the associated protein. 
              </li>
              <li className="mx-3">
                <strong>Significance:</strong> This refers to the <i><b>aggregation significance (-log10 P-value)</b></i> which was calculated during RRA.
              </li>
              <li className="mx-3">
                <strong>Top in ...?:</strong> These columns indicate whether the given gene was encountered in the corresponding aggregate under the selected conditions.
              </li>
              <li className="mx-3">
                <strong>Protein Evidence:</strong> Evidence obtained from PXD018602.
              </li>
              <li className="mx-3">
                <strong>Perfusion Score:</strong> Mean score based on perfusion rates for tissues where the gene was relatively underexpressed.
              </li>
            </ul>
        </div>

        
        <div className="row pt-4">
          <TableProvider>
            <Aggtable/>
          </TableProvider>
        </div>

        <div className="row mx-1 pt-4">
          <Footer />
        </div>
        
      </div>  
    </div>
  );

}

export default Transmemfoc;