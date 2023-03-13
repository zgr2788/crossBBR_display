import logo from './logo.svg';
import './App.css';

const App = () => {

  return (
    <>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div class="container-fluid">
          <a class="navbar-brand" href=""><h1><p class="text-primary">BBB Data Repository</p></h1></a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarColor01">
            <ul class="navbar-nav me-auto">
              <li class="nav-item px-5">
                <a class="nav-link active" href="">Homepage
                  <span class="visually-hidden">(current)</span>
                </a>
              </li>
              <li class="nav-item px-5">
                <a class="nav-link" href="/omics">RNA-Seq</a>
              </li>
              <li class="nav-item px-5">
                <a class="nav-link" href="">Section 2</a>
              </li>
              <li class="nav-item px-5">
                <a class="nav-link" href="">Section 3</a>
              </li>
              <li class="nav-item px-5">
                <a class="nav-link" href="/downloads">Downloads</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  
      
  
      <svg xmlns="http://www.w3.org/2000/svg" class="d-block user-select-none container-fluid p-4" width="100%" height="200" aria-label="Placeholder: Image cap" focusable="false" role="img" preserveAspectRatio="xMidYMid slice" viewBox="0 0 318 180" style="font-size:1.125rem;text-anchor:middle">
        <rect width="100%" height="100%" fill="#868e96"></rect>
        <text x="50%" y="50%" fill="#dee2e6" dy=".3em">Home Banner - TBD</text>
      </svg>
  
    
      <div class="container-fluid p-4">
        <div class="row">
          <h1>About</h1>
          <br />
          <p>Vestibulum pretium metus aliquam tortor dapibus, non vestibulum lorem accumsan. Vestibulum interdum tortor vitae nisl laoreet, in interdum lacus consequat. In tempor dolor at nulla dictum, quis pretium metus euismod. Nam feugiat sit amet enim vitae blandit. Integer facilisis justo at velit pharetra ultricies. Sed eu lectus non felis blandit sagittis. Ut hendrerit non dolor id aliquam. Pellentesque consequat nisi vel eros rhoncus, eget consectetur metus rhoncus. In sed neque mollis, rhoncus turpis in, feugiat felis. Quisque posuere euismod consequat. Praesent vitae ante et lacus vehicula fringilla in ac ligula. Morbi nec suscipit tortor. Sed aliquet lorem quam, et molestie nisl vulputate ac. Donec faucibus ligula vel hendrerit sollicitudin. In hac habitasse platea dictumst.</p>
        </div>
        <br />
        <div class="row">
          <h1>Contents</h1>
          <br />
          <p>Vestibulum pretium metus aliquam tortor dapibus, non vestibulum lorem accumsan. Vestibulum interdum tortor vitae nisl laoreet, in interdum lacus consequat. In tempor dolor at nulla dictum, quis pretium metus euismod. Nam feugiat sit amet enim vitae blandit. Integer facilisis justo at velit pharetra ultricies. Sed eu lectus non felis blandit sagittis. Ut hendrerit non dolor id aliquam. Pellentesque consequat nisi vel eros rhoncus, eget consectetur metus rhoncus. In sed neque mollis, rhoncus turpis in, feugiat felis. Quisque posuere euismod consequat. Praesent vitae ante et lacus vehicula fringilla in ac ligula. Morbi nec suscipit tortor. Sed aliquet lorem quam, et molestie nisl vulputate ac. Donec faucibus ligula vel hendrerit sollicitudin. In hac habitasse platea dictumst.</p>
        </div>
        <br />
        <div class="row">
          <h1>Layout</h1>
          <br />
          <p>Vestibulum pretium metus aliquam tortor dapibus, non vestibulum lorem accumsan. Vestibulum interdum tortor vitae nisl laoreet, in interdum lacus consequat. In tempor dolor at nulla dictum, quis pretium metus euismod. Nam feugiat sit amet enim vitae blandit. Integer facilisis justo at velit pharetra ultricies. Sed eu lectus non felis blandit sagittis. Ut hendrerit non dolor id aliquam. Pellentesque consequat nisi vel eros rhoncus, eget consectetur metus rhoncus. In sed neque mollis, rhoncus turpis in, feugiat felis. Quisque posuere euismod consequat. Praesent vitae ante et lacus vehicula fringilla in ac ligula. Morbi nec suscipit tortor. Sed aliquet lorem quam, et molestie nisl vulputate ac. Donec faucibus ligula vel hendrerit sollicitudin. In hac habitasse platea dictumst.</p>
        </div>
      </div>
    
  
      <footer id="footer" class="container-fluid p-4">
        <ul class="list-group list-group-horizontal">
          <li class="list-group-item bg-transparent"><a href="">GitHub</a></li>
          <li class="list-group-item bg-transparent"><a href="">Links-1</a></li>
          <li class="list-group-item bg-transparent"><a href="">Links-2</a></li>
        </ul>
        <br />
        <div class="row">
          <p>License info...</p>
          <p>Acknowledgements...</p>
        </div>
      </footer>
    </>
    );
 
}

export default App;
