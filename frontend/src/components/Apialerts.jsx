import {React, useState, useEffect} from "react";
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';


const Apialert = () => {

    const [APIstat, setAPIstat] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [dismiss, setDismiss] = useState(true)
    const [fails, setFails] = useState(0)

    const pingApi = async () => {

        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };


        const response = await fetch("/api/", requestOptions);
        

        if (!response.ok) {
            setAPIstat(false)
            setLoaded(true)
            setFails(fails+1)
        }
        else {
            setAPIstat(true)
            setLoaded(true)
            setDismiss(true)
        }

    }

    // Ping api on load, then ping every 5 seconds until connection is established
    useEffect(() => {
        setTimeout(() => pingApi(), 5000);
    }, [fails])

    return(
        <>

        {loaded && dismiss && 
            <div className='container-fluid d-flex justify-content-center'>
            {{
                true:
                    <Alert key="info" variant="info" onClose={() => {setDismiss(false)}} dismissible>
                        <Alert.Heading>
                            API connection established successfully!
                        </Alert.Heading>
                    </Alert>
                ,

                false:
                    <Alert key="danger" variant="danger" onClose={() => {setDismiss(false)}} dismissible>
                        <Alert.Heading>
                            Failed to connect to API!
                        </Alert.Heading>

                        <p>This might be due to the server sleeping. Please wait...</p>
                    </Alert>
              }[APIstat]}
            </div>
        }

        </>
        )
    
    

}


export default Apialert;