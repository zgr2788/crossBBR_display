import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import { UserContext } from './context/UserContext';
import { useContext, useState } from 'react';

const App = () => {

  const [pageArgs, setPageArgs, filtArgs, setFiltArgs, sortArgs, setSortArgs]  = useContext(UserContext)


  // Get current page
  const CurrentPage = () => {
    return(
      <div>
        {{
          home: <Homepage />
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
