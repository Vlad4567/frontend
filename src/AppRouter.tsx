import * as React from 'react';
import { BrowserHistory } from 'history';
import { Router, RouterProps } from 'react-router-dom';

interface Props extends Omit<RouterProps, 'location' | 'navigator'> {
  children: React.ReactNode;
  history: BrowserHistory;
}

export const AppRouter: React.FC<Props> = ({ children, history, ...rest }) => {
  const [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      location={state.location}
      navigator={history}
      navigationType={state.action}
      {...rest}
    >
      {children}
    </Router>
  );
};
