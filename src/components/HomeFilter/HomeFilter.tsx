/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../../types/category';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import searchIcon from '../../img/icons/icon-search.svg';
import { RoundButton } from '../RoundButton/RoundButton';
import './HomeFilter.scss';
import { getCategories } from '../../api/categories';

interface Props {
  className?: string
}

export const HomeFilter: React.FC<Props> = ({
  className = '',
}) => {
  const navigate = useNavigate();
  const [searchInputValue, setSearchInputValue] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories()
      .then((response) => {
        setCategories(response);
      });
  }, []);

  const handleCategoryOnClick = (
    id: number,
  ) => {
    setActiveCategory(categories.find(category => category.id === id) || null);
  };

  return (
    <div className={`home-filter ${className}`}>
      <div className="home-filter__categories">
        {categories.map(category => (
          <DropDownButton
            placeholder={category.name}
            size="small"
            key={category.id}
            onClick={() => {
              handleCategoryOnClick(category.id);
            }}
            active={activeCategory?.id === category.id}
            className="home-filter__category"
          />
        ))}
      </div>

      <label
        className="home-filter__search-block"
        htmlFor="homeFilterInput"
      >
        <div className="home-filter__search">
          <img src={searchIcon} alt="Search icon" />
          <input
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            className="home-filter__search-input"
            type="text"
            id="homeFilterInput"
            placeholder="Search by Services, Master, Studio"
          />
          <RoundButton
            className="home-filter__search-submit"
            onClick={() => navigate('search', {
              state: {
                text: searchInputValue,
                category: activeCategory,
              },
            })}
          >
            Search
          </RoundButton>
        </div>
      </label>
    </div>
  );
};
