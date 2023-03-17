import {React, useState, useEffect} from "react";
import Alert from 'react-bootstrap/Alert';
import './Fade.css'

const Apialerts = () => {

    const [APIstat, setAPIstat] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [init, setInit] = useState(true)
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
    }, [pingApi, fails])

    return(
        <>
        {{
           
            true:
            <div>
            {dismiss && 
                <div className='container-fluid d-flex justify-content-end fixed-bottom bottom-0 end-0'>
                {{
                    true:
                        <div className="fadeOut" onAnimationEnd={() => setDismiss(false)}>

                            <Alert key="success" variant="success" onClose={() => {setDismiss(false)}} dismissible>
                                <Alert.Heading>
                                    API connection established successfully!
                                </Alert.Heading>
                            </Alert>
                        
                        </div>
                    ,
    
                    false:
                        <Alert key="danger" variant="danger" onClose={() => {setDismiss(false)}} dismissible>
                            <Alert.Heading>
                                Failed to connect to API!
                            </Alert.Heading>
                
                            <p>This might be due to the server sleeping. Please wait before refreshing the page.</p>
                        </Alert>
                  }[APIstat]}
                </div>
            }
            </div>
            ,

            false:
            <div>   
            {init && 
            <div className="container-fluid d-flex justify-content-end fixed-bottom bottom-0 end-0">
                <div className="fadeOut" onAnimationEnd={() => setInit(false)}>
                    
                    <Alert key="info" variant="info" onClose={() => {setInit(false)}} dismissible>
                        <Alert.Heading>
                            Testing API connection...
                        </Alert.Heading>

                        <p>We'll keep you posted.</p>
                    </Alert>

                </div>
            </div>
            }
            </div> 




        }[loaded]}



        </>
        )
    
    

}


export default Apialerts;