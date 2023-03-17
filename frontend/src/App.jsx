import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import { UserContext } from './context/UserContext';
import { useContext } from 'react';
import Downloads from './components/Downloads';
import Transmemfoc from './components/Transmemfoc';
import Loader from './components/Loader';

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
            <br/>
            <div className="container-fluid d-flex justify-content-center"><Loader /></div>
          </div>
        }[pageArgs]}
      </div>
    )
  }


  return (
    <>

      <Navbar />

      <CurrentPage />

    </>
  );
}

export default App;
