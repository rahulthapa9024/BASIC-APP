import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider, useSelector } from 'react-redux'; // ✅ Import useSelector
import { store } from './store/store';
import { BrowserRouter } from 'react-router-dom';
import TopBar from './Pages/TopBar';

const RootComponent = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthWrapper />
      </BrowserRouter>
    </Provider>
  );
};

const AuthWrapper = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  return (
    <>
      {isAuthenticated && <TopBar />}
      <App />
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);