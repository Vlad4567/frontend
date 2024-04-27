import './index.css';
import { createRoot } from 'react-dom/client';
import { Router } from './Router';

createRoot(document.getElementById('root') as HTMLElement).render(<Router />);
