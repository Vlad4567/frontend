import { Outlet, useNavigate } from 'react-router-dom';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { useAppSelector } from './app/hooks';
import { Notifications } from './components/Notifications/Notifications';
import globalRouter from './globalRouter';
import './App.scss';

export const App: React.FC = () => {
  const {
    headerShown,
    headerType,
    footerShown,
  } = useAppSelector(state => state.appSlice);
  const navigate = useNavigate();

  globalRouter.navigate = navigate;

  return (
    <>
      {headerShown && <Header type={headerType} />}

      <Outlet />

      <Notifications />

      {footerShown && <Footer />}
    </>
  );
};
