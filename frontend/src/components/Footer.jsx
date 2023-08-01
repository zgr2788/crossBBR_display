import React from "react";

const Footer = () => {
    return(
        <footer className="footer">
        <div className="row">
            <ul className="list-group list-group-horizontal container-fluid w-100">
                <li className="list-group-item bg-transparent"><a href="https://github.com/zgr2788/crossBBR_display" rel="noreferrer" target="_blank" className="mx-4 px-2">GitHub</a></li>
                <li className="list-group-item bg-transparent"><a href="https://adebalilab.org/" target = "_blank" rel="noreferrer"  className="mx-4 px-2">Adebali Lab</a></li>
                <li className="list-group-item bg-transparent"><a href="https://mustafaoglulab.com/" target = "_blank" rel="noreferrer"  className="mx-4 px-2">Mustafaoglu Lab</a></li>
            </ul>
    
            <p className="text-muted pt-2 px-0"><i>This software is distributed under the MIT license, click <a href="https://opensource.org/license/mit/" rel="noreferrer" target="_blank">here</a> to learn more.</i></p>
        </div>
        </footer>
    );
}


export default Footer;