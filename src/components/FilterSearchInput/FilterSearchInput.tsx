import searchIcon from '../../img/icons/icon-search.svg';
import './FilterSearchInput.scss';

interface Props
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export const FilterSearchInput: React.FC<Props> = ({
  className = '',
  ...rest
}) => {
  return (
    <label
      className={`filter-search-input ${className}`}
    >
      <div className="filter-search-input__block">
        <img src={searchIcon} alt="Search icon" />
        <input
          className="filter-search-input__search-input"
          type="text"
          {...rest}
        />
      </div>
    </label>
  );
};
