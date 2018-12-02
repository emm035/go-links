'use es6';

import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import { createMuiTheme } from '@material-ui/core/styles';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import './css/index.css';
import App from './js/containers/App';
import reducers from './js/reducers';

console.clog = (key, ...logItems) => {
  typeof key === 'string' &&
    (window.log || []).find(debug => key.startsWith(debug)) &&
    console.log(key, ...logItems);
};

const theme = createMuiTheme({
  palette: {
    common: { black: '#000', white: '#fff' },
    background: { paper: '#fff', default: 'rgba(223, 227, 235, 1)' },
    primary: {
      light: 'rgba(124, 152, 182, 1)',
      main: 'rgba(66, 91, 118, 1)',
      dark: 'rgba(45, 62, 80, 1)',
      contrastText: '#fff',
    },
    secondary: {
      light: 'rgba(127, 222, 210, 1)',
      main: 'rgba(0, 189, 165, 1)',
      dark: 'rgba(0, 163, 141, 1)',
      contrastText: '#fff',
    },
    error: {
      light: 'rgba(248, 169, 173, 1)',
      main: 'rgba(242, 84, 91, 1)',
      dark: 'rgba(217, 76, 83, 1)',
      contrastText: '#fff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)',
    },
  },
});

const store = createStore(reducers, applyMiddleware(thunk));

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root'),
);
