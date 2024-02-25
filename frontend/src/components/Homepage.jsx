// Landing page

import React from "react";
import './Fade.css'
import Footer from "./FooterMain";


const Homepage = () => {

    return(
      <div className="fadeIn mx-4 full-height">
          

          <div className="container-fluid position-relative full-height">

            <div className="row pt-2 mt-4">
              <h1>About</h1>
              <p>
                The Brendo (short for uniquely transcribed genes in brain endothelial cells) resource aims to provide a reference for 
                differentially expressed genes in the blood-brain barrier (BBB) - with a special emphasis on genes posessing transmembrane helices - in order 
                to facilitate future research concerned with finding therapeutic targets on the BBB for drug delivery to the brain. It was created by combining
                a total of 264 publicly available healthy bulk RNA-Seq samples from 63 studies encompassing 16 different tissues including the BBB. To create the resource, 
                various configurations for differential gene expression testing (employing <a href="https://doi.org/10.1186/s13059-014-0550-8" target="_blank" rel="noreferrer">DESeq2</a> & <a href="https://doi.org/10.1186/s13059-022-02648-4" target="_blank" rel="noreferrer">WRST</a> as 
                statistical tests) and <a href=" https://doi.org/10.1093/bioinformatics/btr709" target="_blank" rel="noreferrer">Robust Rank Aggregation (RRA)</a> were 
                used alongside other minor additions.
              </p>
            </div>
            

            <div className="row pt-4">
              <h1>Additional Information</h1>
              <p>
                Source code for the website is available under the GitHub repository for users who wish to keep a local copy of the resource.
                Similarly, raw result lists can be accessed as part of the source code for additional analyses if needed. For contact and support,
                use either the GitHub issues page or the contact addresses under the <i><b>Support</b></i> tab. Finally, the website was not designed to
                be used with mobile devices, so additional bugs may be present.   
              </p>
            </div>

            <div className="row pt-4">
              <h1>Acknowledgements</h1>
              <p>
                This website was created with the efforts of Sabancı University faculty, particularly with the inputs of <a href="https://adebalilab.org/" target = "_blank" rel="noreferrer">Ogün Adebali</a> and 
                <a href="https://mustafaoglulab.com/" target = "_blank" rel="noreferrer"> Nur Mustafaoğlu</a>. Special thanks to <a href="https://tfguclu.github.io/" target = "_blank" rel="noreferrer">Tandaç Furkan Güçlü</a> and 
                <a href="https://zeynepkilinc.github.io/" target = "_blank" rel="noreferrer"> Zeynep Kılınç</a>, for their inputs as the first testers of the resource. This 
                resource is a part of the project supported by the Scientific and Technological Research Council of Türkiye (TÜBİTAK) 1001 program.  
              </p>
            </div>

            <div className="row mx-1 position-absolute bottom-0">
              <Footer />
            </div>

          </div>


          
       
           
      </div>
    );

}

export default Homepage;