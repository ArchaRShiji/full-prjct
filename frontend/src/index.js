import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './style.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import router from './router';
import AutoLogin from './components/AutoLogin';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>  
      <AutoLogin>
        <RouterProvider router={router} />
      </AutoLogin>
    </Provider>
);

reportWebVitals();