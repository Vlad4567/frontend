import './Stars.scss';
import blackStars from '../../img/stars/large-stars.png';
import whiteStars from '../../img/stars/small-stars.png';

interface Props {
  className?: string;
  type: 'black' | 'white';
  size: 'large' | 'small';
}

export const Stars: React.FC<Props> = ({
  type,
  className = '',
  size,
}) => {
  const pathStars = type === 'black' ? blackStars : whiteStars;

  return (
    <img
      src={pathStars}
      alt="stars"
      className={`stars stars--${size} ${className}`}
    />
  );
};
