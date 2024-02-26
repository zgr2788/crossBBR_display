import React from "react";
import './Fade.css'
import Footer from "./Footer";

const Support = () => {
    return(
    <div className='fadeIn mx-4'>
        <div className="container-fluid p-4 page-body">
            <div className="row pt-2">
                <h1 className="px-2">Contact</h1>
                <p className='pt-2'>For all issues & suggestions, contact <a href='mailto:ozgurbeker@sabanciuniv.edu'>ozgurbeker@sabanciuniv.edu</a>.</p>
            </div>

            <div className="row pt-4">
                <h1 className="px-2">Citations</h1>
                <p className='pt-2'>If you have used this resource as part of your work, please cite: <a href='#' rel="noreferrer" target="_blank">(to be updated)</a>.</p>
            </div>

            <div className="footer ot-4">
                <Footer />
            </div>
        </div>
    </div>

    );
}

export default Support









