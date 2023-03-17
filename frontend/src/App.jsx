import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import { UserContext } from './context/UserContext';
import { useContext } from 'react';
import Downloads from './components/Downloads';
import Transmemfoc from './components/Transmemfoc';
import Apialerts from './components/Apialerts';

const App = () => {

  const [pageArgs]  = useContext(UserContext)


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
