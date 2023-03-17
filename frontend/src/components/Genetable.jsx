// Genetable base component

import { useState, useEffect } from 'react'
import Loader from './Loader'
import Plotmodal from './Plotmodal'

const Genetable = ({ sortArgs, filtArgs, apiURL, inclusive}) => {


    const [genes, setGenes] = useState(null)
    const [loading, setLoading] = useState(false)
    const [active, setActive] = useState(false)
    const [curID, setCurID] = useState(null)



    const fetchGenes = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };


        const response = await fetch("/api/omics/" + apiURL +"/", requestOptions);
        

        if (!response.ok) {
            console.log("Bad Request")
        }
        else {
            const data = await response.json()
            setGenes(JSON.parse(data))
            setLoading(true)
        }
    }

    const handleModal = () => {
        setActive(!active);
        setTimeout(() => setCurID(null), 200);
    }

    const handlePlot = (geneID) => {
        setCurID(geneID)
        setActive(true)
    }
    

    // For mount purposes
   
    useEffect(() => {
      fetchGenes();
    // eslint-disable-next-line
    }, [])

    return(
        
        <>
        

        {loading ? (
            <>
            <Plotmodal active={active} geneID={curID} handleModal={handleModal}/>

            <div>
                {{
                    true:
                    <>
                      <div className="table-responsive">
                            <table className="table table-hover center">
                                <thead>
                                    <tr className="table-active bg-transparent">
                                      <th scope="col"><p className="text-info">Ensembl ID</p></th>
                                      <th scope="col"><p className="text-info">Gene Symbol</p></th>
                                      <th scope="col"><p className="text-info">Rank p-val</p></th>
                                      <th scope="col"><p className="text-info">Mean Perfusion Score</p></th>
                                      <th scope="col"><p className="text-info">Top in DESeq2 Aggregate?</p></th>
                                      <th scope="col"><p className="text-info">Top in DESeq2 Bootstrap?</p></th>
                                      <th scope="col"><p className="text-info">Top in WRST Aggregate?</p></th>
                                      <th scope="col"><p className="text-info">Top in WRST Bootstrap?</p></th>
                                      <th scope="col"><p className="text-info">Protein Evidence from PXD01862?</p></th>
                                      <th scope="col"><p className="text-info text-center">Actions</p></th>
                                    </tr>
                                </thead>
                                <tbody>
                                  {Object.keys(genes).map((geneID, idx) => (
                                      <tr key={geneID}>
                                          <td><p className="text-info"><strong>{genes[geneID]["Name"]}</strong></p></td>
                                          <td><a href={genes[geneID]["uniprot"]} target="_blank" rel='noreferrer'>{genes[geneID]["gene_names"]}</a></td>
                                          <td>{genes[geneID]["Score"]}</td>
                                          <td>{genes[geneID]["Mean Perfusion Score"]}</td>
                                          <td>{genes[geneID]["DESeq2_Appeared"] ? <span>&#x2714;</span> : <span>&#x2718;</span>}</td>
                                          <td>{genes[geneID]["DESeq2_Validated"] ? <span>&#x2714;</span> : <span>&#x2718;</span>}</td>
                                          <td>{genes[geneID]["Wilcox_Appeared"] ? <span>&#x2714;</span> : <span>&#x2718;</span>}</td>
                                          <td>{genes[geneID]["Wilcox_Validated"] ? <span>&#x2714;</span> : <span>&#x2718;</span>}</td>
                                          <td>{genes[geneID]["Prot_Evidence"] ? <span>&#x2714;</span> : <span>&#x2718;</span>}</td>
                                          <td>
                                            <button className="btn btn-primary" onClick={ () => {handlePlot(geneID)} }>Check Counts</button>
                                          </td>
                                      </tr>
                                  ))}
                                </tbody>
                            </table>
                        </div>
                      </>
                    ,

                    false:
                    <>
                      <div className="table-responsive">
                            <table className="table table-hover center">
                                <thead>
                                    <tr className="table-active bg-transparent">
                                        <th scope="col"><p class="text-info">Ensembl ID</p></th>
                                        <th scope="col"><p class="text-info">Gene Symbol</p></th>
                                        <th scope="col"><p class="text-info">Rank p-val</p></th>
                                        <th scope="col"><p class="text-info">Mean Perfusion Score</p></th>
                                        <th scope="col"><p class="text-info">Top in Bootstrap?</p></th>
                                        <th scope="col"><p class="text-info text-center">Actions</p></th>
                                    </tr>
                                </thead>
                                <tbody>
                                  {Object.keys(genes).map((geneID, idx) => (
                                      <tr key={geneID}>
                                          <td><p className="text-info"><strong>{genes[geneID]["Name"]}</strong></p></td>
                                          <td><a href={genes[geneID]["uniprot"]} target="_blank" rel='noreferrer'>{genes[geneID]["gene_names"]}</a></td>
                                          <td>{genes[geneID]["Score"]}</td>
                                          <td>{genes[geneID]["Mean Perfusion Score"]}</td>
                                          <td>{genes[geneID]["Validated"] ? <span>&#x2714;</span> : <span>&#x2718;</span>}</td>
                                          <td>
                                            <button className="btn btn-primary" onClick={ () => {handlePlot(geneID)} }>Check Counts</button>
                                          </td>
                                      </tr>
                                  ))}
                                </tbody>
                            </table>
                        </div> 
                    </>
                                    
                }[inclusive]}
            </div>
 
            </>

        ) : (<><br/><div className="container-fluid d-flex justify-content-center"><Loader /></div></>)}
      </>

    )
}

export default Genetable;

