import React from "react";

const Footer = () => {
    return(
        <footer className="footer">
        <div className="row">
            <ul className="list-group list-group-horizontal container-fluid">
                <li className="list-group-item bg-transparent">GitHub</li>
                <li className="list-group-item bg-transparent">Links-1</li>
                <li className="list-group-item bg-transparent">Links-2</li>
            </ul>
    
            <p className="text-muted pt-2 px-0"><i>License info & acknowledgements...</i></p>
        </div>
        </footer>
    );
}


export default Footer;