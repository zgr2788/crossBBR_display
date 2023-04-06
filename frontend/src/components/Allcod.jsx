// Dump tables page

import {React} from "react";
import { TableProvider } from "../context/TableContext";
import './Fade.css';
import Dumptable from "./Dumptable";




const Allcod = () => {

  return(
    <div className="fadeIn">
      <br />
      <div className="container-fluid">
        <div className="row">
          <h1>Browse gene tables from tests</h1>
        </div>

        <br />


        <div className="row">
          <h3 className="text-muted">Columns</h3>
          <p>
            <ul>
              <li>
                <strong>Gene ID:</strong> Ensembl gene ID for the given gene.
              </li>
              <li>
                <strong>Gene Name:</strong> Matched HGNC name for the given ID.
              </li>
              <li>
                <strong>Uniprot ID:</strong> Matched Uniprot ID for the associated protein. 
              </li>
              <li>
                <strong>Significance:</strong> This refers to the aggregation significance (-log10) which is calculated during robust rank aggregation. Refer to <i>Differential gene expression analyses</i> for more information.
              </li>
              <li>
                <strong>Top in ...?:</strong> These columns indicate whether the given gene was also encountered in the corresponding aggregate.
              </li>
              <li>
                <strong>Protein Evidence:</strong> Evidence obtained from PXD018602. Refer to <i>Proteomics cross reference</i> for more information.
              </li>
              <li>
                <strong>Perfusion Score:</strong> Mean score based on perfusion rates for tissues where the gene was relatively underexpressed. Refer to <i>Perfusion scores</i> for more information.
              </li>
            </ul>
          </p>
        </div>

        <br />

        <div className="row">
          <h3 className="text-muted">Features</h3>
            <p>
              <ul>
                <li>
                  <strong>Sorts & Filters:</strong> Click the <i>Significance & Perfusion Score</i> columns to sort ascending/descending. Text search/filter is possible for the 
                  <i> Gene ID, Gene Name & Uniprot ID</i> columns. For the <i>Top in ...?</i> columns, it is possible to filter for true/false rows. To search text within the entire table, use
                  the search function in top right.  
                </li>
                <li>
                  <strong>Toolbar:</strong> Select which columns to display, density of the display, show/hide global search & filters, and make the table fullscreen.
                </li>
                <li>
                  <strong>Export:</strong> To export the entire table (does not respect ordering/filtering), use the <i>Export All Genes</i> button. To export selected rows with respect to order,
                  use the <i>Export Selection</i> button.
                </li>
                <li>
                  <strong>Click to Copy / Search / Get Counts:</strong> For the <i>Gene ID</i> column, click the Ensembl ID to copy it to your clipboard. For <i>Gene Name & Uniprot ID</i> columns, click the text to
                  be taken to search the corresponding entry on Human Protein Atlas / InterPro. Click the values in <i>Significance</i> column to check the count distribution for samples. 
                </li>
              </ul>
            </p>
            

        </div>

        <br />
        <br /> 
        <TableProvider>        
          <Dumptable/>
        </TableProvider>
      </div>  
    </div>
  );

}

export default Allcod;