// Downloads page

import React from "react";
import './Fade.css'
import Footer from "./Footer";

const Methods = () => {
  return(
    <div className="fadeIn mx-4">

      <div className="container-fluid p-4 page-body">
        <div className="row pt-2">
          <h1 className="px-2">Methods</h1>
          <p>
            This page provides a summary of methods used in the study. For further details, please consider checking the original manuscript.
          </p>
        </div>
        

        <div className="row pt-4">
          <h3 className="text-muted">Raw data, alignment & quantification</h3>
          <p>
            Raw read data was downloaded from the <a className="text-info" href="https://www.ebi.ac.uk/ena/browser/home" target="_blank" rel="noreferrer">European Nucleotide Archive</a> FASP server.
            Reads were aligned to the human genome using <a className="text-info" href="https://github.com/alexdobin/STAR" target="_blank" rel="noreferrer">STAR</a> (release 2.7.0e) with the reference index generated
            from <a className="text-info" href="https://ftp.ensembl.org/pub/release-107/" rel="noreferrer">GRCh38 - Release 107</a> primary assembly file & annotations. Alignments were quantified through
            R using the featureCounts method provided by the <a className="text-info" href="https://bioconductor.org/packages/release/bioc/html/Rsubread.html" target="_blank" rel="noreferrer">Rsubread</a> package (ver. 2.8.2).
          </p>
        </div>

        <div className="row pt-4">
          <h3 className="text-muted">Differential gene expression analyses</h3>
          <p>
            Pairwise differential gene expression analyses between brain endothelial cells (<i><b>excluding iPSC-derived samples</b></i>) and other tissues were conducted using two approaches.
            First, <a className="text-info" href="https://bioconductor.org/packages/release/bioc/html/DESeq2.html" target="_blank" rel="noreferrer">DESeq2</a> was used with a zero-intercept design which also integrated batch variables 
            (indicated by layout and instrument model in the sample metadata). Model contrasts were extracted for each of the 15 comparisons. A second group of contrasts was obtained only by considering vital tissues (colon, heart, intestine, kidney, liver, lung, vessel).
            Genes with adjusted P &lt; 0.05 were considered significant, which were then ranked based on the number of times they have appeared as significant over 15 or 7 comparisons depending on the run.
          </p>
          <p>
            Using the normalized (median of ratios, see <a className="text-info" href="https://hbctraining.github.io/DGE_workshop/lessons/02_DGE_count_normalization.html" target="_blank" rel="noreferrer">here</a>) count matrices, <a className="text-info" href="https://rpubs.com/LiYumei/806213" target="_blank" rel="noreferrer">Wilcoxon rank-sum test over R</a> was conducted 
            with the same two contrast groups to compare for potential false positives from the negative binomial model. Here, genes with FDR corrected P &lt; 0.05 were considered significant, which were again ranked in the previous manner. The resulting 8 ranked lists are available under the "All Genes" tab.   
          </p>
        </div>

        
        <div className="row pt-5">
          <h1>Transmembrane focus</h1>
          <p>
            The 4 ranked lists from differential gene expression analyses were aggregated through <a className="text-info" href="https://cran.r-project.org/web/packages/RobustRankAggreg/index.html" target="_blank" rel="noreferrer">RobustRankAggreg</a> to derive the final list below.
            List pairs from the 2 workflows were also aggregated separately. Finally for both workflows, 100 runs with subsamples comprised of %60 of the original sample size were generated (without replacement)
            to validate significantly expressed genes and partially rule out sample bias.   
          </p>
        </div>


        <div className="row pt-4">
          <h3 className="text-muted">Proteomics cross reference</h3>
          <p>
            Raw LC-MS/MS data of blood-brain barrier intracerebral microvessels (tagged "BBB") were downloaded from the PRIDE accession <a className="text-info" href="https://www.ebi.ac.uk/pride/archive/projects/PXD018602" target="_blank" rel="noreferrer">PXD018602</a>. Protein intensities were quantified through <a className="text-info" href="https://www.maxquant.org/" target="_blank" rel="noreferrer">MaxQuant</a> (ver. 2.3.0.0) with the provided PTMs.
            After filtering out potential contaminants and decoys, proteins with Q &lt; 0.01 were cross checked with the main aggregate list. 
          </p>
        </div>

        <div className="row pt-4">
          <h3 className="text-muted">Perfusion scores</h3>
          <p>
            Each significant appearance of a gene for liver, heart, skin, kidney and lung comparisons was given a perfusion score, which was obtained by calculating the perfusion rate (ml/100g/min) using <a className="text-info" href="https://bionumbers.hms.harvard.edu/files/Density%20and%20mass%20of%20each%20organ-tissue.pdf" target="_blank" rel="noreferrer">tissue mass</a>  and <a className="text-info" href=" https://doi.org/10.2165/00003088-200847040-00004" target="_blank" rel="noreferrer">blood flow (table 1)</a>. 
            The perfusion score is the mean of the sum of perfusion scores for all runs (4 in total).    
          </p>
        </div>
        
        <div className="footer pt-4">
          <Footer />
        </div>


    
    

     
      </div>
    </div>
  );

}

export default Methods;