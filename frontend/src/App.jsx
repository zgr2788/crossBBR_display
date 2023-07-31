import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import { useContext } from 'react';
import Methods from './components/Methods';
import Transmemfoc from './components/Transmemfoc';
import Apialerts from './components/Apialerts';
import { PageContext } from './context/PageContext';
import Allcod from './components/Allcod';
import Footer from './components/Footer';

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
          allcod : <Allcod />,
          test: 
          <div className='fadeIn mx-4'>
            <div className="container-fluid p-4">
              <div className="row pt-2">
                <h1 className="px-2">Contact</h1>
                <p className='pt-2'>For all issues & suggestions, contact <a href='mailto:ozgurbeker@sabanciuniv.edu'>ozgurbeker@sabanciuniv.edu</a>.</p>
              </div>

              <div className="row fixed-bottom mx-5">
                <Footer />
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
