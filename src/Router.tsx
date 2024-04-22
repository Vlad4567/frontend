import { Navigate, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { App } from './App';
import { HomePage } from './pages/HomePage/HomePage';
import { store } from './app/store';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { AccountPage } from './pages/AccountPage/AccountPage';
import { PersonalDetailsPage } from './pages/PersonalDetailsPage/PersonalDetailsPage';
import { SearchPage } from './pages/SearchPage/SearchPage';
import { SignUpForm } from './components/SignUpForm/SignUpForm';
import { ResetPasswordForm } from './components/ResetPasswordForm/ResetPasswordForm';
import { LoginForm } from './components/LoginForm/LoginForm';
import { EditPublicProfilePage } from './pages/EditPublicProfilePage/EditPublicProfilePage';
import { EditAreaOfWork } from './components/EditAreaOfWork/EditAreaOfWork';
import { EditContacts } from './components/EditContacts/EditContacts';
import { EditAddress } from './components/EditAddress/EditAddress';
import { MasterGallery } from './components/MasterGallery/MasterGallery';
import { EditServices } from './components/EditServices/EditServices';
import { browserHistory } from './utils/history';
import { AppRouter } from './AppRouter';
import { MasterPage } from './pages/MasterPage/MasterPage';
import { MasterGalleryPage } from './pages/MasterGalleryPage/MasterGalleryPage';
import { LoginFormTelegram } from './components/LoginFormTelegram/LoginFormTelegram';

export const Router = () => {
  return (
    <Provider store={store}>
      <AppRouter history={browserHistory}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<HomePage />} />
            <Route path="home" element={<Navigate to="/" replace />} />
            <Route path="master/:id" element={<MasterPage />} />
            <Route path="master/:id/gallery" element={<MasterGalleryPage />} />
            <Route path="login" element={<LoginPage />}>
              <Route index element={<LoginForm />} />
              <Route path="reset-password" element={<ResetPasswordForm />} />
              <Route path="signup" element={<SignUpForm />} />
              <Route
                path="telegram"
                element={
                  <LoginFormTelegram className="login-form-telegram--center" />
                }
              />
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
                <Route index element={<Navigate to="area-of-work" replace />} />
                <Route path="area-of-work" element={<EditAreaOfWork />} />
                <Route path="contacts" element={<EditContacts />} />
                <Route path="address" element={<EditAddress />} />
                <Route path="gallery" element={<MasterGallery />} />
                <Route path="services" element={<EditServices />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AppRouter>
    </Provider>
  );
};
