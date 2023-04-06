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
                <strong>Mean Significance:</strong> Significance (-log10 P-adjusted) for gene, averaged over all comparisons where the gene was significantly expressed. 
              </li>
              <li>
                <strong>Mean Fold Change:</strong> Fold Change for gene, averaged over all comparisons where the gene was significantly expressed.
              </li>
              <li>
                <strong>Appearance Count:</strong> Number of comparisons this gene yielded significant. Maximum 14 for all tissues and 7 for tissue subsetted lists.
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
                  <strong>Sorts & Filters:</strong> Click <i>Numeric</i> columns to sort ascending/descending. Text search/filter is possible for the 
                  <i> Gene ID & Gene Name</i> columns. For the <i>Top in ...?</i> columns, it is possible to filter for true/false rows. To search text within the entire table, use
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
                  <strong>Click to Copy / Search / Get Counts:</strong> For the <i>Gene ID</i> column, click the Ensembl ID to copy it to your clipboard. For the <i>Gene Name</i> column, click the text to
                  be taken to search the corresponding entry on Human Protein Atlas. Click the values in <i >Numeric</i> columns to check the count distribution for samples. 
                </li>
                <li>
                  <strong>Tissue Search (Coarse):</strong> Using the table-wide toolbar (top right next to filters icon), enter a tissue name to search genes which were significant in only that comparison. May not work properly for multiple tissues separated by whitespace. 
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