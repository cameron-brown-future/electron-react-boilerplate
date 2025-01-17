import ReactDOM from 'react-dom';
import App from './App';

const container = document.getElementById('root')!;
const root = document.createElement('div')
container.appendChild(root)
ReactDOM.render(<App />, root);

// calling IPC exposed from preload script
// window.electron.ipcRenderer.once('ipc-example', (arg) => {
//   // eslint-disable-next-line no-console
//   console.log(arg);
// });
// window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
