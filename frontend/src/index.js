import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";

import './index.css';
import App from './App';
import store from './store'
import * as serviceWorker from './serviceWorker';
import {
  showToaster
} from "./slice/toasterSlice";

ReactDOM.render(
  <Provider store={store}>
    <App />
    </Provider>,
  document.getElementById("root")
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
  onUpdate: () => {
    store.dispatch(showToaster({ message: 'A new version of the site is available. Please close and reopen tab.' }))
  }
});