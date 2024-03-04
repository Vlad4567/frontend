/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { DropDownButton } from '../../components/DropDownButton/DropDownButton';
import { DropDownSortButton }
  from '../../components/DropDownSortButton/DropDownSortButton';
import { FilterSearchInput }
  from '../../components/FilterSearchInput/FilterSearchInput';
import { RadioInput } from '../../components/RadioInput/RadioInput';
import './SearchPage.scss';

type ActiveDropDown = 'Category' | 'Price' | 'City' | 'Sort';

export const SearchPage: React.FC = () => {
  const [activeDropDown, setActiveDropDown]
    = useState<ActiveDropDown | null>(null);

  const handleShowDropDown = (dropDown: ActiveDropDown) => {
    setActiveDropDown(c => {
      return c === dropDown ? null : dropDown;
    });
  };

  return (
    <main className="search-page">
      <form className="search-page__filter">
        <div className="search-page__filter-header">
          <div className="search-page__filter-search-by">
            <small className="search-page__filter-search-by-title">
              Search by
            </small>
            <div className="search-page__filter-search-by-buttons">
              <label>
                <div className="search-page__filter-search-by-button">
                  <RadioInput name="card" checked />
                  Services
                </div>
              </label>

              <label>
                <div className="search-page__filter-search-by-button">
                  <RadioInput name="card" />
                  Masters
                </div>
              </label>
            </div>
          </div>

          <FilterSearchInput
            className="search-page__filter-input"
            placeholder="Enter the name of the service"
            color="dark"
          />
        </div>

        <div className="search-page__filter-dropdown-buttons">
          <DropDownButton
            className="search-page__filter-dropdown-button"
            size="large"
            placeholder="City"
            icon
          />
          <DropDownButton
            className="search-page__filter-dropdown-button"
            size="large"
            placeholder="Price range"
            icon
          />
          <DropDownButton
            className="search-page__filter-dropdown-button"
            size="large"
            placeholder="Category"
            icon
          />
          <DropDownSortButton
            active={activeDropDown === 'Sort'}
            onClick={() => handleShowDropDown('Sort')}
          />
        </div>
      </form>
    </main>
  );
};
