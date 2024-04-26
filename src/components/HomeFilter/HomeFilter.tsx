/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Category } from '../../types/category';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import { RoundButton } from '../RoundButton/RoundButton';
import { FilterSearchInput } from '../FilterSearchInput/FilterSearchInput';
import { SearchWithParams } from '../../types/main';
import { getSearchWith } from '../../helpers/functions';
import './HomeFilter.scss';
import { useCategories } from '../../hooks/useCategories';

interface Props {
  className?: string;
}

export const HomeFilter: React.FC<Props> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, selectedCategory, setSelectedCategory } = useCategories();

  useEffect(() => {
    const keys = Array.from(searchParams.entries());
    const params = new URLSearchParams(searchParams);

    keys.forEach(([key]) => {
      if (params.get(key) === '') {
        params.delete(key);
      }
    });

    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const setSearchWith = (params: SearchWithParams) => {
    const search = getSearchWith(params, searchParams);

    setSearchParams(search);
  };

  const handleCategoryOnClick = (category: Category) => {
    if (selectedCategory !== category) {
      setSelectedCategory(category);
      setSearchWith({
        subcategories: category.subcategories.map(item => item.id),
      });
    } else {
      setSelectedCategory(null);
      setSearchWith({ subcategories: null });
    }
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    navigate(`search?${searchParams.toString()}`);
  };

  return (
    <form onSubmit={handleOnSubmit} className={`home-filter ${className}`}>
      <div className="home-filter__categories">
        {categories.data.map(category => (
          <DropDownButton
            placeholder={category.name}
            size="small"
            key={category.id}
            onClick={() => {
              handleCategoryOnClick(category);
            }}
            active={selectedCategory?.id === category.id}
            className="home-filter__category"
          />
        ))}
      </div>

      <div className="home-filter__search">
        <FilterSearchInput
          value={searchParams.get('text') || ''}
          onChange={e => setSearchWith({ text: e.target.value })}
          placeholder="Enter the name of the service"
        />
        <RoundButton type="submit" className="home-filter__search-submit">
          Search
        </RoundButton>
      </div>
    </form>
  );
};
