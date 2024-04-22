import { useEffect } from 'react';
import { useDocumentTitle } from 'usehooks-ts';
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { useAppSelector } from './app/hooks';
import { Notifications } from './components/Notifications/Notifications';
import globalRouter from './globalRouter';
import { websiteName } from './helpers/variables';
import './App.scss';
import { convertHyphenToSpace } from './helpers/functions';

export const App: React.FC = () => {
  const { headerShown, headerType, footerShown } = useAppSelector(
    state => state.appSlice,
  );
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const lastPathName = pathname.split('/').pop();

  useDocumentTitle(convertHyphenToSpace(lastPathName || '') || websiteName);

  useEffect(() => {
    if (!searchParams.get('scroll')) {
      window.scroll({ top: 0, behavior: 'smooth' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
