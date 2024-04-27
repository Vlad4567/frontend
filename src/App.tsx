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
import { Notifications } from './components/Notifications/Notifications';
import globalRouter from './globalRouter';
import { websiteName } from './helpers/variables';
import { convertHyphenToSpace } from './helpers/functions';
import { useApp } from './hooks/useApp';
import { TypeNotification, useNotification } from './hooks/useNotification';

export const App: React.FC = () => {
  const { app } = useApp();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const lastPathName = pathname.split('/').pop();

  useDocumentTitle(convertHyphenToSpace(lastPathName || '') || websiteName);

  useEffect(() => {
    if (!searchParams.get('scroll')) {
      window.scroll({ top: 0, behavior: 'smooth' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const notification = searchParams.get('notification');

    if (notification) {
      const params = new URLSearchParams(searchParams);

      params.delete('notification');
      setSearchParams(params);
      addNotification(notification as TypeNotification);
    }
  }, [addNotification, searchParams, setSearchParams]);

  globalRouter.navigate = navigate;

  return (
    <>
      {app.headerShown && <Header type={app.headerType} />}

      <Outlet />

      <Notifications />

      {app.footerShown && <Footer />}
    </>
  );
};
