// Transmembrane focused tables page

import {React} from "react";
import { TableProvider } from "../context/TableContext";
import Aggtable from "./Aggtable";
import './Fade.css'


const Transmemfoc = () => {

  return(
    <div className="fadeIn">
      <svg xmlns="http://www.w3.org/2000/svg" className="d-block user-select-none container-fluid p-4" width="100%" height="200" aria-label="Placeholder: Image cap" focusable="false" role="img" preserveAspectRatio="xMidYMid slice" viewBox="0 0 318 180">
        <rect width="100%" height="100%" fill="#868e96"></rect>
        <text x="50%" y="50%" fill="#dee2e6" dy=".3em" textAnchor="middle">Methods Banner - TBD</text>
      </svg>

      <div className="container-fluid p-4">
        <div className="row">
          <h1>Methods</h1>
        </div>
        <br />

        <div className="row">
          <h3 className="text-muted">Raw data, alignment & quantification</h3>
          <p>
            Raw read data was downloaded from the <a className="text-info" href="https://www.ebi.ac.uk/ena/browser/home" target="_blank" rel="noreferrer">European Nucleotide Archive</a> FASP server.
            Reads were aligned to the human genome using <a className="text-info" href="https://github.com/alexdobin/STAR" target="_blank" rel="noreferrer">STAR</a> (release 2.7.0e) with the reference index generated
            from <a className="text-info" href="https://ftp.ensembl.org/pub/release-107/" rel="noreferrer">GRCh38 - Release 107</a> primary assembly file & annotations. Alignments were quantified through
            R using the featureCounts method provided by the <a className="text-info" href="https://bioconductor.org/packages/release/bioc/html/Rsubread.html" target="_blank" rel="noreferrer">Rsubread</a> package (ver. 2.8.2).
          </p>
        </div>

        <br />

        <div className="row">
          <h3 className="text-muted">Differential gene expression analyses</h3>
          <p>
            Pairwise differential gene expression analyses between brain endothelial cells (NOT sourced from stem cells) and other tissues were conducted using two approaches.
            First, <a className="text-info" href="https://bioconductor.org/packages/release/bioc/html/DESeq2.html" target="_blank" rel="noreferrer">DESeq2</a> was used with a zero-intercept design which also integrated batch variables 
            (indicated by layout and instrument model in the sample metadata). Model contrasts were extracted for each of the 15 comparisons. A second group of contrasts was obtained only by considering vital tissues (colon, heart, intestine, kidney, liver, lung, vessel).
            Genes with adjusted P &lt; 0.05 and fold change (log2) &gt; 1 were considered significant, which were then ranked based on the number of times they have appeared as significant over 15 or 8 comparisons depending on the run.
          </p>
          <p>
            Using the normalized (median of ratios, see <a className="text-info" href="https://hbctraining.github.io/DGE_workshop/lessons/02_DGE_count_normalization.html" target="_blank" rel="noreferrer">here</a>) count matrices, <a className="text-info" href="https://rpubs.com/LiYumei/806213" target="_blank" rel="noreferrer">Wilcoxon rank-sum test over R</a> was conducted 
            with the same two contrast groups to compare for potential false positives from the negative binomial model. Here, genes with FDR corrected P &lt; 0.05 and fold change (log2) &gt; 0 were considered significant, which were again ranked in the previous manner.   
          </p>
          <p>
            The resulting 4 ranked lists were aggregated through <a className="text-info" href="https://cran.r-project.org/web/packages/RobustRankAggreg/index.html" target="_blank" rel="noreferrer">RobustRankAggreg</a> to derive the final list below.
            List pairs from the 2 workflows were also aggregated separately. Finally for both workflows, 100 runs with subsamples comprised of %60 of the original sample size were generated (without replacement)
            to validate significantly expressed genes and partially rule out sample bias.   
          </p>
        </div>

        <br />

        <div className="row">
          <h3 className="text-muted">Proteomics cross reference</h3>
          <p>
            Raw LC-MS/MS data of blood-brain barrier intracerebral microvessels (tagged "BBB") were downloaded from the PRIDE accession <a className="text-info" href="https://www.ebi.ac.uk/pride/archive/projects/PXD018602" target="_blank" rel="noreferrer">PXD018602</a>. Protein intensities were quantified through <a className="text-info" href="https://www.maxquant.org/" target="_blank" rel="noreferrer">MaxQuant</a> (ver. 2.3.0.0) with the provided PTMs.
            After filtering out potential contaminants and decoys, proteins with Q &lt; 0.01 were cross checked with the main aggregate list. 
          </p>
        </div>

        <br />

        <div className="row">
          <h3 className="text-muted">Perfusion scores</h3>
          <p>
            Each significant appearance of a gene for liver, heart, skin, kidney and lung comparisons was given a perfusion score, which was obtained by calculating the perfusion rate (ml/100g/min) using <a className="text-info" href="https://bionumbers.hms.harvard.edu/files/Density%20and%20mass%20of%20each%20organ-tissue.pdf" target="_blank" rel="noreferrer">tissue mass</a>  and <a className="text-info" href=" https://doi.org/10.2165/00003088-200847040-00004" target="_blank" rel="noreferrer">blood flow (table 1)</a>. 
            The perfusion score is the mean of the sum of perfusion scores for all runs (4 in total).    
          </p>
        </div>

        <br />
    
        <br />

        <div className="row">
          <h1>Gene Tables</h1>
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
          <Aggtable/>
        </TableProvider>
      
      </div>
    </div> 
  );

}

export default Transmemfoc;