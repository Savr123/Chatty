import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Route, Routes, BrowserRouter  as Router } from 'react-router-dom';

import Chat from './components/Chat/Chat';
import Login from './components/Account/LoginPage';
import SignUp from './components/Account/RegistrationPage';
import { Provider } from 'react-redux';
import store, { persistor } from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistStore loading={null} persistor={persistor}>
      <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/signIn" element={<Login/>}></Route>
                <Route path="/signUp" element={<SignUp/>}></Route>
                <Route path="/" element={<App/>}></Route>
          </Routes>
        </Router>
      </React.StrictMode>
    </PersistStore>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
