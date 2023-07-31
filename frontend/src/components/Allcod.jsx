// Dump tables page

import {React} from "react";
import { TableProvider } from "../context/TableContext";
import './Fade.css';
import Dumptable from "./Dumptable";
import Footer from "./Footer";




const Allcod = () => {

  return(
    <div className="fadeIn mx-4">
      <br />
      <div className="container-fluid">
        <div className="row pt-2">
          <h1 className="px-2">Browse Merged Results Tables</h1>
        </div>


        <div className="row">
          <h3 className="text-muted pt-4">Help</h3>
          <p>
            This section includes the merged results tables for all possible combinations of the following 3 binary conditions: the statistical test performed 
            (marked by <i><b>DESeq2</b></i> or <i><b>WRST</b></i>), whether the genes of interest were overexpressed or underexpressed in BBB samples 
            (marked by <i><b>UP</b></i> or <i><b>DN</b></i>), and whether all of the data or select tissues were considered during testing 
            (marked by <i><b>Subset</b></i>). Use the tabs to navigate between lists.

            <br />

            <i><b className="text-info">Click on the significance value of a gene to view its normalized count distribution across samples.</b></i>
          </p>
        </div>


        <div className="row">
          <h3 className="text-muted pt-4">Columns</h3>
            <ul>
              <li className="mx-3">
                <strong>Gene ID:</strong> Ensembl gene ID for the given gene.
              </li>
              <li className="mx-3">
                <strong>Gene Name:</strong> Matched HGNC symbol for the given ID.
              </li>
              <li className="mx-3">
                <strong>Mean Significance:</strong> Significance (<i><b>-log10 of adjusted P value</b></i>) for the given gene, averaged over all comparisons under the selected conditions where the gene was differentially expressed. 
              </li>
              <li className="mx-3">
                <strong>Mean Fold Change:</strong> Fold change (<i><b>log2 -- BBB counts in the numerator</b></i>) for the given gene, averaged over all comparisons under the selected conditions where the gene was differentially expressed.
              </li>
              <li className="mx-3">
                <strong>Appearance Count:</strong> Number of comparisons where this gene was differentially expressed under the selected conditions. Maximum possible is 15 for all tissues and 7 for tissue subsetted lists.
              </li>
            </ul>
        </div>

        <div className="row pt-4">
          <TableProvider>        
            <Dumptable/>
          </TableProvider>
        </div>

        
        <div className="row mx-1 pt-4">
          <Footer />
        </div>
      </div>  
    </div>
  );

}

export default Allcod;