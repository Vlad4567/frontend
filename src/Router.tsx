import {
  HashRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { App } from './App';
import { HomePage } from './pages/HomePage/HomePage';

export const Router = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="404" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};