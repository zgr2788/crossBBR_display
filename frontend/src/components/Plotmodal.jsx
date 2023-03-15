// Modal to display bokeh plot
import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Plotmodal = ({active, geneID, handleModal}) => {

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
            console.log("Modal with gene id: " + geneID)
            window.Bokeh.embed.embed_item(bokehDump, 'plot')
        }
    }

    //handleCounts(geneID)

    

    return(

        <Modal show={active} onHide={handleModal}>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                Woohoo, you're reading this text in a modal!

            </Modal.Body>
            
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModal}>
                Close
              </Button>
            </Modal.Footer>

        </Modal>

    )




}

export default Plotmodal;