import { Outlet } from 'react-router-dom';
import './App.scss';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { useAppSelector } from './app/hooks';

export const App: React.FC = () => {
  const {
    headerShown,
    headerType,
    footerShown,
  } = useAppSelector(state => state.appSlice);

  return (
    <>
      {headerShown && <Header type={headerType} />}

      <main>
        <Outlet />
      </main>

      {footerShown && <Footer />}
    </>
  );
};
