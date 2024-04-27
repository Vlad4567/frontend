import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { NotificationMessage } from '../NotificationMessage/NotificationMessage';
import { effectDuration } from '../../helpers/variables';
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
          timeout={effectDuration}
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
