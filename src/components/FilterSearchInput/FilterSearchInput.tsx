import searchIconWhite from '../../img/icons/icon-search.svg';
import searchIconDark from '../../img/icons/icon-search-dark.svg';
import './FilterSearchInput.scss';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  color?: 'dark' | 'light';
}

export const FilterSearchInput: React.FC<Props> = ({
  className = '',
  color = 'light',
  ...rest
}) => {
  const pathToSearchIcon = color === 'light' ? searchIconWhite : searchIconDark;

  return (
    <label
      className={`filter-search-input filter-search-input--${color} ${className}`}
    >
      <div className="filter-search-input__block">
        <img src={pathToSearchIcon} alt="Search icon" />
        <input
          className="filter-search-input__search-input"
          type="text"
          {...rest}
        />
      </div>
    </label>
  );
};
