import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import { UserContext } from './context/UserContext';
import { useContext } from 'react';
import Downloads from './components/Downloads';

const App = () => {

  const [pageArgs]  = useContext(UserContext)


  // Get current page
  const CurrentPage = () => {
    return(
      <div>
        {{
          home: <Homepage />,
          downloads : <Downloads />
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
