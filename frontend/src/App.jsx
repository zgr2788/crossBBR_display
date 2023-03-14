import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import { UserContext } from './context/UserContext';
import { useContext } from 'react';
import Downloads from './components/Downloads';
import Transmemfoc from './components/Transmemfoc';

const App = () => {

  const [pageArgs]  = useContext(UserContext)


  // Get current page
  const CurrentPage = () => {
    return(
      <div>
        {{
          home: <Homepage />,
          downloads : <Downloads />,
          trmemfoc : <Transmemfoc />
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
