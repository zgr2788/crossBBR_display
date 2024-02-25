import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import { useContext } from 'react';
import Methods from './components/Methods';
import Transmemfoc from './components/Transmemfoc';
import Apialerts from './components/Apialerts';
import { PageContext } from './context/PageContext';
import Allcod from './components/Allcod';
import Support from './components/Support'
const App = () => {

  const [pageArgs]  = useContext(PageContext)


  // Get current page
  const CurrentPage = () => {
    return(
      <div className='full-height'>
        {{
          home: <Homepage />,
          methods : <Methods />,
          trmemfoc : <Transmemfoc />,
          allcod : <Allcod />,
          test: <Support />
        }[pageArgs]}
      </div>
    )
  }


  return (
    <div>

      <Navbar />

      <CurrentPage />

      <Apialerts />

    </div>
  );
}

export default App;
