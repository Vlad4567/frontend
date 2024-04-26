import darkStars from '../../img/stars/large-stars.png';
import lightStars from '../../img/stars/small-stars.png';
import './Stars.scss';

interface Props {
  className?: string;
  type: 'dark' | 'light';
  size: 'large' | 'small';
}

export const Stars: React.FC<Props> = ({ type, className = '', size }) => {
  const pathStars = type === 'dark' ? darkStars : lightStars;

  return (
    <img
      src={pathStars}
      alt="stars"
      className={`stars stars--${size} ${className}`}
    />
  );
};
