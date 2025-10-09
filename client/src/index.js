import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Route, Routes, BrowserRouter  as Router } from 'react-router-dom';

import SignIn from './Components/Account/SignIn';
import SignUp from './Components/Account/SignUp';
import { Provider } from 'react-redux';
import { persistor, store } from './Redux/store';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/signIn" element={<SignIn/>}></Route>
                <Route path="/signUp" element={<SignUp/>}></Route>
                <Route path="/" element={<App/>}></Route>
          </Routes>
        </Router>
      </React.StrictMode>
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
