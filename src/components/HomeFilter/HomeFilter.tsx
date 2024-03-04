/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../../types/category';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import { RoundButton } from '../RoundButton/RoundButton';
import './HomeFilter.scss';
import { getCategories } from '../../api/categories';
import { FilterSearchInput } from '../FilterSearchInput/FilterSearchInput';

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

  const handleOnSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    navigate('search', {
      state: {
        text: searchInputValue,
        category: activeCategory,
      },
    });
  };

  return (
    <form className={`home-filter ${className}`}>
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

      <div className="home-filter__search">
        <FilterSearchInput
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
          placeholder="Enter the name of the service"
        />
        <RoundButton
          type="submit"
          className="home-filter__search-submit"
          onSubmit={handleOnSubmit}
        >
          Search
        </RoundButton>
      </div>
    </form>
  );
};
