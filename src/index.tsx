import 'reset-css';
import 'normalize.css';
import './index.scss';
import { createRoot } from 'react-dom/client';
import { App } from './App';

createRoot(document.getElementById('root') as HTMLElement)
  .render(<App />);
