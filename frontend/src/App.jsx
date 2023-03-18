import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import { useContext } from 'react';
import Downloads from './components/Downloads';
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
          downloads : <Downloads />,
          trmemfoc : <Transmemfoc />,
          test: 
          <div className='container-fluid'>
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
