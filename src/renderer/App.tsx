import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import ShadowRoot from './ShadowRoot';


import { Button } from '@mui/material';
import { FunctionComponent, useState } from 'react';
import { Theme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import { createTheme } from 'devias/theme';

const rules = [
  {
    type: 'replace',
    name: 'Inject CMLess',
    replace: 'https://bordeaux.futurecdn.net/bordeaux.js',
    with: 'https://localhost:8080/cmless.js',
    match: 'https://bordeaux.futurecdn.net/bordeaux.js',
    enabled: true
  },
  {
    type: 'redirect',
    name: 'Taboola Overwrite',
    redirect: 'https://cdn.taboola.com/libtrc/impl.20220609-7-RELEASE.js',
    with: 'https://127.0.0.1:8987/sm.js',
    enabled: false
  }
]
const Hello = () => {
  const [urlValue, setUrlValue] = useState<string>('');
  const handleRefreshClick = () => {
    console.log(urlValue)
  }

  const handleUrlChange = event => {
    setUrlValue(event.target.value)
  }
  return (
    <div>
      <input type="text" onChange={handleUrlChange} value={urlValue}/>
      <button onClick={handleRefreshClick} >Refresh</button>
      {rules.map(rule => <div key={rule.name} className="rule-list__row" >
        <div className="rule-list__cell rule-list__cell--name" >{rule.name}</div>
        <div className="rule-list__cell rule-list__cell--type" >{rule.type}</div>
        <div className="rule-list__cell rule-list__cell--enabled" >{rule.enabled}</div>
        <Button className="rule-list__button--edit">Edit</Button>
      </div>)}
    </div>
  );
};

const themeSelector = (darkMode): Theme =>
  createTheme({
    mode: darkMode ? 'dark' : 'light',
  });

export default function App() {
  // const { darkMode } = useTypedSelector(state => state.general);
  return (
    <StyledEngineProvider injectFirst>
      <ShadowRoot>
        <ThemeProvider theme={themeSelector(false)}>
          <ScopedCssBaseline>
            <Router>
              <Routes>
                <Route path="/" element={<Hello />} />
              </Routes>
            </Router>
          </ScopedCssBaseline>
        </ThemeProvider>
      </ShadowRoot>
    </StyledEngineProvider>
  );
}




// const App: FunctionComponent<{}> = props => {
//   const { darkMode } = useTypedSelector(state => state.general);
//   return (
//     <StyledEngineProvider injectFirst>
//       <ShadowRoot>
//         <ThemeProvider theme={themeSelector(darkMode)}>
//           <ScopedCssBaseline>
//             <AdTool {...props} />
//           </ScopedCssBaseline>
//         </ThemeProvider>
//       </ShadowRoot>
//     </StyledEngineProvider>
//   );
// };

// export default App;
