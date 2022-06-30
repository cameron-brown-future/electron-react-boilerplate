/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, BrowserView, shell, ipcMain, session, protocol } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}





const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));


  const view = new BrowserView()
  mainWindow.setBrowserView(view)
  view.setBounds({ x: 0, y: 500, width: 300, height: 300 })
  setTimeout(() => {
    console.log("LOADING")
    view.webContents.loadURL('https://www.google.com/')
  }, 1000)
  console.log(view.webContents.session)

  // const filter = {
  //   urls: ['https://*.github.com/*', '*://electron.github.io/*']
  // }
  //
  // session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
  // // chrome.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
  //   console.log("MAJOR REQUEST")
  //   details.requestHeaders['User-Agent'] = 'MyAgent'
  //   callback({ requestHeaders: details.requestHeaders })
  // })
  //
  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
    console.log(view.webContents.session.webRequest)
    view.webContents.session.webRequest.onBeforeRequest({
      urls: ['https://*/*','http://*/*']
    }, (details, callback) => {
      console.log(details.url)
      if (details.url.includes('google.com'))
        callback({ redirectURL: details.url.replace('google.com', 'google.co.uk') })
      // else callback({ url: details.url })
      // console.log("MAJOR REQUEST", details.url, details.url.replace('electronjs.org', 'google.com'))
      // details.url = details.url.replace('electronjs.org', 'google.com')
      // details.requestHeaders['User-Agent'] = 'MyAgent'
      // callback({ redirectURL: details.url })
    })
    //
    // protocol.interceptBufferProtocol("http", (request, result) => {
    //   console.log('reqy', request.url)
    //   // return result
    //   // if (request.url === "http://www.google.com")
    //   //   return result(content);
    //   // ... // fetch other http protocol content and return to the electron
    // });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
