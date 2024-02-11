import { Outlet } from 'react-router-dom';
import './App.scss';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';

export const App: React.FC = () => {
  return (
    <>
      <Header type="dark" />

      <main className="main">
        <Outlet />
      </main>

      <Footer />
    </>
  );
};
