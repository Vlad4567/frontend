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
import { AccountPage } from './pages/AccountPage/AccountPage';
import { PersonalDetailsPage }
  from './pages/PersonalDetailsPage/PersonalDetailsPage';
import { SearchPage } from './pages/SearchPage/SearchPage';
import { SignUpForm } from './components/SignUpForm/SignUpForm';
import { ResetPasswordForm }
  from './components/ResetPasswordForm/ResetPasswordForm';
import { LoginForm } from './components/LoginForm/LoginForm';
import { EditPublicProfilePage }
  from './pages/EditPublicProfilePage/EditPublicProfilePage';

export const Router = () => {
  return (
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<HomePage />} />
            <Route
              path="home"
              element={<Navigate to="/" replace />}
            />
            <Route path="login" element={<LoginPage />}>
              <Route index element={<LoginForm />} />
              <Route path="reset-password" element={<ResetPasswordForm />} />
              <Route path="signup" element={<SignUpForm />} />
            </Route>
            <Route path="search" element={<SearchPage />} />
            <Route path="account" element={<AccountPage />}>
              <Route
                path="personal-details"
                element={<PersonalDetailsPage />}
              />
              <Route
                path="edit-public-profile"
                element={<EditPublicProfilePage />}
              >
                <Route path="area-of-work" element={<p>fine</p>} />
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </Provider>
  );
};
