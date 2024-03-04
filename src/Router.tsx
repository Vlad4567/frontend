import {
  HashRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { App } from './App';
import { HomePage } from './pages/HomePage/HomePage';
import { store } from './app/store';
import { LoginPage } from './pages/LoginPage/LoginPage';

export const Router = () => {
  return (
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<HomePage />} />
            <Route path="home" element={<Navigate to="/" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </Provider>
  );
};
