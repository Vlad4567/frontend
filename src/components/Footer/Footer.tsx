import { useLocation } from 'react-router-dom';
import './Footer.scss';

export const Footer: React.FC = () => {
  const { pathname } = useLocation();

  if (pathname === '/404') {
    return null;
  }

  return (
    <footer className="Footer">
      123
    </footer>
  );
};
