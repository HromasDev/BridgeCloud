import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './styles/App.css';

import AppRouter from './router/Router';

function App() {
  const isDarkTheme = localStorage.getItem('darkTheme') === 'true';

    useEffect(() => {
        document.body.classList.toggle('dark-theme', isDarkTheme);
    }, [isDarkTheme]);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
