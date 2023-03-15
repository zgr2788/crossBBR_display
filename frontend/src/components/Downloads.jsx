// Downloads page

import React from "react";
import './Fade.css'

const Downloads = () => {
  return(
    <div className="fadeIn">
        <svg xmlns="http://www.w3.org/2000/svg" className="d-block user-select-none container-fluid p-4" width="100%" height="200" aria-label="Placeholder: Image cap" focusable="false" role="img" preserveAspectRatio="xMidYMid slice" viewBox="0 0 318 180">
            <rect width="100%" height="100%" fill="#868e96"></rect>
            <text x="50%" y="50%" fill="#dee2e6" dy=".3em" textAnchor="middle">Downloads Banner - TBD</text>
        </svg>


        <div className="container-fluid p-4">
          <div className="row">
            <h1>Downloads</h1>
            <br />
            <p>Vestibulum pretium metus aliquam tortor dapibus, non vestibulum lorem accumsan. Vestibulum interdum tortor vitae nisl laoreet, in interdum lacus consequat. In tempor dolor at nulla dictum, quis pretium metus euismod. Nam feugiat sit amet enim vitae blandit. Integer facilisis justo at velit pharetra ultricies. Sed eu lectus non felis blandit sagittis. Ut hendrerit non dolor id aliquam. Pellentesque consequat nisi vel eros rhoncus, eget consectetur metus rhoncus. In sed neque mollis, rhoncus turpis in, feugiat felis. Quisque posuere euismod consequat. Praesent vitae ante et lacus vehicula fringilla in ac ligula. Morbi nec suscipit tortor. Sed aliquet lorem quam, et molestie nisl vulputate ac. Donec faucibus ligula vel hendrerit sollicitudin. In hac habitasse platea dictumst.</p>
          </div>
        </div>
    

        <footer id="footer" className="container-fluid p-4">
          <ul className="list-group list-group-horizontal">
            <li className="list-group-item bg-transparent">GitHub</li>
            <li className="list-group-item bg-transparent">Links-1</li>
            <li className="list-group-item bg-transparent">Links-2</li>
          </ul>
          <br />
          <div className="row">
            <p>License info...</p>
            <p>Acknowledgements...</p>
          </div>
        </footer>
    </div>
  );

}

export default Downloads;