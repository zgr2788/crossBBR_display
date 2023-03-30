import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import { useContext } from 'react';
import Methods from './components/Methods';
import Transmemfoc from './components/Transmemfoc';
import Apialerts from './components/Apialerts';
import { PageContext } from './context/PageContext';

const App = () => {

  const [pageArgs]  = useContext(PageContext)


  // Get current page
  const CurrentPage = () => {
    return(
      <div>
        {{
          home: <Homepage />,
          methods : <Methods />,
          trmemfoc : <Transmemfoc />,
          test: 
          <div className='fadeIn'>
            <div className="container-fluid p-4">
              <div className="row">
                <p>For all issues & suggestions, contact <u>ozgurbeker@sabanciuniv.edu</u>.</p>
              </div>
            </div>
          </div>
        }[pageArgs]}
      </div>
    )
  }


  return (
    <>

      <Navbar />

      <CurrentPage />

      <Apialerts />

    </>
  );
}

export default App;
