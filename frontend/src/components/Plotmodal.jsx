// Modal to display bokeh plot
import {React, useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Plotmodal = ({active, geneID, handleModal}) => {

    const [loading, setLoading] = useState(false)

    const handleCounts = async(geneID) => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        const response = await fetch("/api/omics/plots/counts/" + geneID + "/", requestOptions);


        if (!response.ok) {
            console.log("Bad Request")
        }
        else {
            const data = await response.json()
            const bokehDump = JSON.parse(data)

            // Clean previous plot
            var parent = document.getElementById("plotParent")
            var child = document.getElementById("plot")
            parent.removeChild(child)

            // Add new plot
            var newchild = document.createElement('div');
            newchild.id = "plot"
            newchild.className = "bk-root"
            parent.appendChild(newchild)
            window.Bokeh.embed.embed_item(bokehDump, 'plot')

            setLoading(false)
        }
    }

    useEffect(() => {
        setLoading(true)
        geneID !== undefined && geneID !== null && handleCounts(geneID)
    }, [geneID])
    

    return(
        <>
        
            <Modal show={active} onHide={() => {setLoading(false);handleModal();}} size="xl">

                <Modal.Header closeButton>
                    <Modal.Title>{geneID} - Counts Plot</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {loading && <h1 className='text-info text-center'><strong>Loading...</strong></h1>}
                    <div id="plotParent">
                        <div id="plot" className="bk-root"></div>
                    </div> 
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={() => {setLoading(false);handleModal();}}>
                        Close
                    </Button>
                </Modal.Footer>

            </Modal>
         
    
        </>



    )




}

export default Plotmodal;