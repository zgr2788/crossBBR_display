// Genetable base component

import { useState, useEffect, useContext } from 'react'
import { TableContext } from '../context/TableContext'
import Loader from './Loader'
import Plotmodal from './Plotmodal'

const Genetable = () => {

    const [filtArgs,,sortArgs,,tableArgs,,loading,setLoading] = useContext(TableContext)



    const [genes, setGenes] = useState(null)
    const [active, setActive] = useState(false)
    const [curID, setCurID] = useState(null)
    const [curName, setCurName] = useState(null)
    
    const parsedFilt = JSON.parse(filtArgs)
    const parsedSort = JSON.parse(sortArgs)



    const fetchGenes = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        const response = await fetch("/api/omics/" + tableArgs +"/", requestOptions);
        

        if (!response.ok) {
            console.log("Bad Request")
        }
        else {
            const data = await response.json()
            return(JSON.parse(data))
        }
    }

    const handleSort = (genes) => {
        console.log(parsedSort, genes)
        setGenes(genes)
        setLoading(true)
    } 

    const handleModal = () => {
        setActive(!active);
        setTimeout(() => setCurID(null), 200);
    }

    const handlePlot = (geneID, geneName) => {
        setCurID(geneID)
        setCurName(geneName)
        setActive(true)
    }
    

    // For mount purposes
   
    useEffect(() => {
      fetchGenes().then((genes) => {handleSort(genes)})
    // eslint-disable-next-line
    }, [tableArgs, sortArgs])

    return(
        
        <>
        

        {loading ? (
            <>
            <Plotmodal active={active} geneID={curID} geneName={curName} handleModal={handleModal}/>

            <div>
                {{
                    true:
                    <>
                      <div className="table-responsive">
                            <table className="table table-hover center">
                                <thead>
                                    <tr className="table-active bg-transparent">
                                      <th scope="col"><p className="text-info text-center">Ensembl ID</p></th>
                                      <th scope="col"><p className="text-info text-center">Gene Symbol</p></th>
                                      { parsedFilt["Rank_p__val"] && <th scope="col"><p className="text-info text-center">Rank p-val</p></th> }
                                      { parsedFilt["Mean_Perfusion_Score"] && <th scope="col"><p className="text-info text-center">Mean Perfusion Score</p></th> }
                                      { parsedFilt["DESeq2_Appeared"] && <th scope="col"><p className="text-info text-center">Top in DESeq2 Aggregate?</p></th> }
                                      { parsedFilt["DESeq2_Validated"] && <th scope="col"><p className="text-info text-center">Top in DESeq2 Bootstrap?</p></th> }
                                      { parsedFilt["Wilcox_Appeared"] && <th scope="col"><p className="text-info text-center">Top in WRST Aggregate?</p></th> }
                                      { parsedFilt["Wilcox_Validated"] && <th scope="col"><p className="text-info text-center">Top in WRST Bootstrap?</p></th> }
                                      { parsedFilt["Prot_Evidence"] && <th scope="col"><p className="text-info text-center">Protein Evidence from PXD01862?</p></th> }
                                      { parsedFilt["Actions"] && <th scope="col"><p className="text-info text-center">Actions</p></th> }
                                    </tr>
                                </thead>
                                <tbody>
                                  {Object.keys(genes).map((geneID, idx) => (
                                      <tr key={geneID}>
                                          <td><p className="text-info text-center"><strong>{genes[geneID]["Name"]}</strong></p></td>
                                          <td><p className="text-center"><a href={genes[geneID]["uniprot"]} target="_blank" rel='noreferrer'>{genes[geneID]["gene_names"]}</a></p></td>
                                          { parsedFilt["Rank_p__val"] && <td><p className="text-center">{genes[geneID]["Score"]}</p></td>}
                                          { parsedFilt["Mean_Perfusion_Score"] && <td><p className="text-center">{genes[geneID]["Mean Perfusion Score"]}</p></td>}
                                          { parsedFilt["DESeq2_Appeared"] && <td><p className="text-center">{genes[geneID]["DESeq2_Appeared"] ? <span>&#x2714;</span> : <span>&#x2718;</span>}</p></td>}
                                          { parsedFilt["DESeq2_Validated"] && <td><p className="text-center">{genes[geneID]["DESeq2_Validated"] ? <span>&#x2714;</span> : <span>&#x2718;</span>}</p></td>}
                                          { parsedFilt["Wilcox_Appeared"] && <td><p className="text-center">{genes[geneID]["Wilcox_Appeared"] ? <span>&#x2714;</span> : <span>&#x2718;</span>}</p></td>}
                                          { parsedFilt["Wilcox_Validated"] && <td><p className="text-center">{genes[geneID]["Wilcox_Validated"] ? <span>&#x2714;</span> : <span>&#x2718;</span>}</p></td>}
                                          { parsedFilt["Prot_Evidence"] && <td><p className="text-center">{genes[geneID]["Prot_Evidence"] ? <span>&#x2714;</span> : <span>&#x2718;</span>}</p></td>}
                                          { parsedFilt["Actions"] && <td>
                                            <div className="d-flex justify-content-center">
                                                <button className="btn btn-primary" onClick={ () => {handlePlot(geneID, genes[geneID]["gene_names"])} }>Check Counts</button>
                                            </div>
                                          </td>}
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
                                        <th scope="col"><p className="text-info text-center">Ensembl ID</p></th>
                                        <th scope="col"><p className="text-info text-center">Gene Symbol</p></th>
                                        { parsedFilt["Rank_p__val"] && <th scope="col"><p className="text-info text-center">Rank p-val</p></th>}
                                        { parsedFilt["Mean_Perfusion_Score"] && <th scope="col"><p className="text-info text-center">Mean Perfusion Score</p></th>}
                                        { parsedFilt["Validated"] && <th scope="col"><p className="text-info text-center">Top in Bootstrap?</p></th>}
                                        { parsedFilt["Actions"] &&  <th scope="col"><p className="text-info text-center">Actions</p></th>}
                                    </tr>
                                </thead>
                                <tbody>
                                  {Object.keys(genes).map((geneID, idx) => (
                                      <tr key={geneID}>
                                          <td ><p className="text-info text-center"><strong>{genes[geneID]["Name"]}</strong></p></td>
                                          <td><p className="text-center"><a href={genes[geneID]["uniprot"]} target="_blank" rel='noreferrer'>{genes[geneID]["gene_names"]}</a></p></td>
                                          { parsedFilt["Rank_p__val"] && <td><p className="text-center">{genes[geneID]["Score"]}</p></td>}
                                          { parsedFilt["Mean_Perfusion_Score"] && <td><p className="text-center">{genes[geneID]["Mean Perfusion Score"]}</p></td>}
                                          { parsedFilt["Validated"] && <td><p className="text-center">{genes[geneID]["Validated"] ? <span>&#x2714;</span> : <span>&#x2718;</span>}</p></td>}
                                          { parsedFilt["Actions"] &&  <td>
                                            <div className="d-flex justify-content-center">
                                                <button className="btn btn-primary" onClick={ () => {handlePlot(geneID)} }>Check Counts</button>
                                            </div>
                                          </td>}
                                      </tr>
                                  ))}
                                </tbody>
                            </table>
                        </div> 
                    </>
                                    
                }[tableArgs === "all"]}
            </div>
 
            </>

        ) : (<><br/><div className="container-fluid d-flex justify-content-center"><Loader /></div></>)}
      </>

    )
}

export default Genetable;

