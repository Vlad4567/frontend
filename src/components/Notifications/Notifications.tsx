import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { NotificationMessage } from '../NotificationMessage/NotificationMessage';
import styleVariables from '../../styles/variables.module.scss';
import { extractFirstNumber } from '../../helpers/functions';
import { useNotification } from '../../hooks/useNotification';
import './Notifications.scss';

export const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <TransitionGroup className="notifications">
      {notifications.map(notification => (
        <CSSTransition
          unmountOnExit
          key={notification.id}
          timeout={extractFirstNumber(styleVariables['effect-duration'])}
        >
          <NotificationMessage
            className="notifications__notification"
            title={notification.title}
            description={notification.description}
            icon={notification.icon}
            onClose={() => removeNotification(notification.id)}
          />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};
