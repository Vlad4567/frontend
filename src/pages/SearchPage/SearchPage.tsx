/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  useEffect, useRef, useState,
} from 'react';
import { useDebounce, useMediaQuery, useOnClickOutside } from 'usehooks-ts';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { CreateModal } from '../../components/CreateModal/CreateModal';
import { DropDownButton } from '../../components/DropDownButton/DropDownButton';
import { DropDownSortButton }
  from '../../components/DropDownSortButton/DropDownSortButton';
import { FilterSearchInput }
  from '../../components/FilterSearchInput/FilterSearchInput';
import { RadioInput } from '../../components/RadioInput/RadioInput';
import './SearchPage.scss';
import closeIcon from '../../img/icons/icon-dropdown-close.svg';
import { Category, SubCategory } from '../../types/category';
import { getCategories } from '../../api/categories';
import { Checkbox } from '../../components/CheckBox/Checkbox';
import variables from '../../styles/variables.module.scss';
import { debounceDelay } from '../../helpers/variables';
import {
  getCities,
  getFilteredMasterCards,
  getFilteredServiceCards,
} from '../../api/searchPage';
import { City } from '../../types/searchPage';
import { Pagination } from '../../components/Pagination/Pagination';
import { getSearchWith } from '../../helpers/functions';
import * as typesMaster from '../../types/master';
import { Page, TypeCard } from '../../types/main';
import { SearchWithParams } from '../../types/searchWith';
import { MasterCard } from '../../components/MasterCard/MasterCard';
import { ServiceCard } from '../../components/ServiceCard/ServiceCard';

type ActiveDropDown = 'Category' | 'Price' | 'City' | 'Sort';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const text = searchParams.get('text') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const directionSort = searchParams.get('direction') || '';
  const propertySort = searchParams.get('property') || '';

  const [activeDropDown, setActiveDropDown]
    = useState<ActiveDropDown | null>(null);
  const [cityValue, setCityValue] = useState('');
  const [cityList, setCityList] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [searchBy, setSearchBy] = useState<TypeCard>('servicecard');
  const [masterCards, setMasterCards]
    = useState<Page<typesMaster.MasterCard> | null>(null);
  const [serviceCards, setServiceCards]
    = useState<Page<typesMaster.ServiceCard> | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const isShownModalCityInput = useMediaQuery(`(max-width: ${variables['tablet-min-width']})`);
  const debouncedCity = useDebounce<string>(cityValue, debounceDelay);
  const debouncedSearchParams = useDebounce(searchParams, debounceDelay);

  const cityInputRef = useRef<HTMLInputElement>(null);
  const cityButtonRef = useRef<HTMLButtonElement>(null);
  const categoryButtonRef = useRef<HTMLButtonElement>(null);
  const priceButtonRef = useRef<HTMLButtonElement>(null);
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const dropDownRef = useRef<HTMLButtonElement>(null);

  const setSearchWith = (params: SearchWithParams) => {
    const search = getSearchWith(params, searchParams);

    setSearchParams(search);
  };

  const handleClickOutside = () => {
    setActiveDropDown(null);
  };

  useOnClickOutside([
    dropDownRef,
    cityButtonRef,
    categoryButtonRef,
    priceButtonRef,
    sortButtonRef,
  ], handleClickOutside);

  const handleToggleDropDown = (dropDown: ActiveDropDown) => {
    setActiveDropDown(c => {
      return c === dropDown ? null : dropDown;
    });
  };

  const handleToggleCategory = (category: Category) => {
    setActiveCategory(c => (c === category ? null : category));
  };

  const handleInputCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setSearchWith({ city: null });
    }

    setCityValue(e.target.value);
  };

  const handleClickOnCategory = () => {
    handleToggleDropDown('Category');

    if (activeDropDown !== 'Category') {
      getCategories()
        .then(res => {
          setCategories(res);
        });
    }
  };

  const handleCityIcon = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    setCityValue('');
  };

  const handleChooseCity = (item: City) => {
    setCityValue(item.name);

    setSearchWith({ city: item.id });

    setActiveDropDown(null);
  };

  const handleChooseSubCategory = (
    subCategory: SubCategory,
    checked: boolean,
  ) => {
    const convertedSubCategories = searchParams
      .getAll('subCategories')
      .map(Number);

    const newSubCategories = convertedSubCategories
      .includes(subCategory.id) && !checked
      ? convertedSubCategories.filter(id => id !== subCategory.id)
      : [...convertedSubCategories, subCategory.id];

    setSearchWith({ subCategories: newSubCategories });
  };

  const handleChangeMinPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
      .replace(/\b0*([1-9]\d*|0)\b/, '$1')
      .replace(/[^\d]/g, '');

    setSearchWith({ minPrice: inputValue });
  };

  const handleChangeMaxPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
      .replace(/\b0*([1-9]\d*|0)\b/, '$1')
      .replace(/[^\d]/g, '');

    setSearchWith({ maxPrice: inputValue });
  };

  const handleChangeSort = (
    typeDirection: 'ASC' | 'DESC',
    typeProperty: 'rating' | 'price',
  ) => {
    setSearchWith({ direction: typeDirection, property: typeProperty });
  };

  const clearPriceRange = () => {
    setSearchWith({ minPrice: null, maxPrice: null });
  };

  const handleSearchBy = (typeUser: TypeCard) => {
    setSearchWith({
      direction: null,
      property: null,
      minPrice: null,
      maxPrice: null,
    });
    setSearchBy(typeUser);
  };

  const clearSortBy = () => {
    setSearchWith({ direction: null, property: null });
  };

  const clearSubCategories = () => {
    setSearchWith({ subCategories: null });
  };

  const handleClearEverything = () => {
    setSearchParams(new URLSearchParams());
  };

  useEffect(() => {
    if (debouncedCity) {
      getCities(0, 4, debouncedCity)
        .then(res => setCityList(res.content));
    } else {
      setCityList([]);
    }
  }, [debouncedCity]);

  useEffect(() => {
    if (activeDropDown === 'City' && !isShownModalCityInput) {
      cityInputRef.current?.focus();
    }
  }, [activeDropDown, isShownModalCityInput]);

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

  useEffect(() => {
    switch (searchBy) {
      case 'master':
        getFilteredMasterCards(
          currentPage - 1, 16, debouncedSearchParams.toString(),
        )
          .then(setMasterCards);
        break;

      case 'servicecard':
        getFilteredServiceCards(
          currentPage - 1, 16, debouncedSearchParams.toString(),
        )
          .then(setServiceCards);
        break;

      default:
        break;
    }
  }, [debouncedSearchParams, currentPage, searchBy]);

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
                  <RadioInput
                    name="card"
                    onChange={() => handleSearchBy('servicecard')}
                    checked={searchBy === 'servicecard'}
                  />
                  Services
                </div>
              </label>

              <label>
                <div className="search-page__filter-search-by-button">
                  <RadioInput
                    name="card"
                    onChange={() => handleSearchBy('master')}
                    checked={searchBy === 'master'}
                  />
                  Masters
                </div>
              </label>
            </div>
          </div>

          <FilterSearchInput
            value={text}
            onChange={(e) => setSearchWith({ text: e.target.value })}
            className="search-page__filter-input"
            placeholder="Enter the name of the service"
            color="dark"
          />
        </div>

        <div className="search-page__filter-dropdown-buttons">
          <>
            <DropDownButton
              active={!isShownModalCityInput && activeDropDown === 'City'}
              input={!isShownModalCityInput && activeDropDown === 'City'}
              icon={!isShownModalCityInput && activeDropDown === 'City'}
              inputRef={cityInputRef}
              size="large"
              placeholder={cityValue || 'City'}
              handleIconOnClick={handleCityIcon}
              value={cityValue}
              onChange={handleInputCity}
              className="search-page__filter-dropdown-button"
              onClick={() => handleToggleDropDown('City')}
              ref={cityButtonRef}
            />

            {activeDropDown === 'City' && (
              <CreateModal media={{ onPhone: true }}>
                {(isShownModalCityInput || !!cityList.length) && (
                  <article
                    className="search-page__dropdown-city"
                    ref={dropDownRef}
                  >
                    <div className="search-page__dropdown-header">
                      <h3 className="search-page__dropdown-header-title">
                        City
                      </h3>
                      <img
                        src={closeIcon}
                        alt="close"
                        className="search-page__dropdown-header-close-icon"
                        onClick={handleClickOutside}
                      />
                    </div>

                    <DropDownButton
                      active
                      input
                      icon
                      size="large"
                      placeholder="City"
                      value={cityValue}
                      onChange={handleInputCity}
                      className="search-page__dropdown-city-search"
                    />

                    {cityValue && (
                      <ul className="search-page__dropdown-city-list">
                        {cityList.map(item => (
                          <li
                            className="search-page__dropdown-city-item"
                            key={item.id}
                            onClick={() => handleChooseCity(item)}
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    )}

                  </article>
                )}
              </CreateModal>
            )}
          </>
          <>
            <DropDownButton
              className="search-page__filter-dropdown-button"
              size="large"
              placeholder="Price range"
              icon
              active={activeDropDown === 'Price'}
              onClick={() => handleToggleDropDown('Price')}
              style={{ minWidth: '140px' }}
              ref={priceButtonRef}
              disabled={searchBy === 'master'}
            />
            {activeDropDown === 'Price' && (
              <CreateModal media={{ onPhone: true }}>
                <article
                  className="search-page__dropdown-price-range"
                  ref={dropDownRef}
                >
                  <div className="search-page__dropdown-header">
                    <h3 className="search-page__dropdown-header-title">
                      Price range
                    </h3>
                    <img
                      src={closeIcon}
                      alt="close"
                      className="search-page__dropdown-header-close-icon"
                      onClick={handleClickOutside}
                    />
                  </div>
                  <div className="search-page__dropdown-price-range-main">
                    <div className="search-page__dropdown-price-range-wraper">
                      <small
                        className="search-page__dropdown-price-range-parameter"
                      >
                        min
                      </small>

                      <input
                        value={minPrice}
                        onChange={handleChangeMinPrice}
                        type="text"
                        placeholder="85"
                        className="search-page__dropdown-price-range-input"
                      />
                    </div>

                    <div className="search-page__dropdown-price-range-wraper">
                      <small
                        className="search-page__dropdown-price-range-parameter"
                      >
                        max
                      </small>

                      <input
                        value={maxPrice}
                        onChange={handleChangeMaxPrice}
                        type="text"
                        placeholder="1000"
                        className="search-page__dropdown-price-range-input"
                      />
                    </div>
                  </div>

                  <div className="search-page__dropdown-price-range-buttons">
                    <DropDownButton
                      size="small"
                      placeholder="Clean"
                      className="search-page__dropdown-price-range-button"
                      onClick={clearPriceRange}
                    />
                    <Button
                      size="small"
                      className="search-page__dropdown-price-range-button"
                      onClick={() => setActiveDropDown(null)}
                    >
                      Apply
                    </Button>
                  </div>
                </article>
              </CreateModal>
            )}
          </>
          <>
            <DropDownButton
              className="search-page__filter-dropdown-button"
              size="large"
              placeholder="Category"
              icon
              active={activeDropDown === 'Category'}
              onClick={handleClickOnCategory}
              ref={categoryButtonRef}
            />
            {activeDropDown === 'Category' && (
              <CreateModal media={{ onPhone: true }}>
                <article
                  className="search-page__categories"
                  ref={dropDownRef}
                >
                  <div className="search-page__dropdown-header">
                    <h3 className="search-page__dropdown-header-title">
                      Category
                    </h3>
                    <img
                      src={closeIcon}
                      alt="close"
                      className="search-page__dropdown-header-close-icon"
                      onClick={handleClickOutside}
                    />
                  </div>

                  <div className="search-page__dropdown-categories-main">

                    <div className="search-page__dropdown-categories-buttons">
                      {categories.map((category) => {
                        const { id, name } = category;

                        return (
                          <DropDownButton
                            className="
                              search-page__dropdown-categories-main-button
                            "
                            size="small"
                            icon
                            key={id}
                            placeholder={name}
                            active={activeCategory === category}
                            onClick={() => handleToggleCategory(category)}
                          />
                        );
                      })}
                    </div>

                    {activeCategory && (
                      <ul className="search-page__dropdown-subcategories">
                        {activeCategory.subcategories.map(subCategory => {
                          const isSubCategoryChecked = searchParams
                            .getAll('subCategories')
                            .some(id => +id === subCategory.id);

                          return (
                            <li
                              className="search-page__dropdown-subcategory-item"
                              key={subCategory.id}
                            >
                              <label className="
                                search-page__dropdown-subcategory
                              "
                              >
                                <Checkbox
                                  className="
                                    search-page__dropdown-subcategory-check
                                  "
                                  checked={isSubCategoryChecked}
                                  onChange={e => handleChooseSubCategory(
                                    subCategory, e.target.checked,
                                  )}
                                />
                                {subCategory.name}
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                  </div>

                  <hr className="search-page__dropdown-hr" />

                  <div className="search-page__dropdown-buttons">
                    <DropDownButton
                      size="small"
                      placeholder="Clean"
                      className="search-page__dropdown-button"
                      onClick={clearSubCategories}
                    />
                    <Button
                      size="small"
                      className="search-page__dropdown-button"
                      onClick={() => setActiveDropDown(null)}
                    >
                      Apply
                    </Button>
                  </div>

                </article>
              </CreateModal>

            )}
          </>
          <>
            <DropDownSortButton
              active={activeDropDown === 'Sort'}
              onClick={() => handleToggleDropDown('Sort')}
              ref={sortButtonRef}
            />
            {activeDropDown === 'Sort' && (
              <CreateModal media={{ onPhone: true }}>
                <article
                  className="search-page__dropdown-sort"
                  onClick={(e) => e.stopPropagation()}
                  ref={dropDownRef}
                >
                  <div className="search-page__dropdown-sort-header">
                    <h3 className="search-page__dropdown-sort-header-title">
                      Sort by
                    </h3>
                    <img
                      src={closeIcon}
                      alt="close"
                      className="search-page__dropdown-sort-header-icon"
                      onClick={handleClickOutside}
                    />
                  </div>
                  <div className="search-page__dropdown-sort-categories">
                    <div className="search-page__dropdown-sort-category">
                      <small
                        className="search-page__dropdown-sort-category-title"
                      >
                        Price:
                      </small>
                      <label
                        className="search-page__dropdown-sort-category-radio"
                      >
                        <RadioInput
                          name="sort"
                          checked={directionSort === 'ASC'
                            && propertySort === 'price'}
                          disabled={searchBy === 'master'}
                          onChange={() => handleChangeSort('ASC', 'price')}
                        />
                        <p className="
                          search-page__dropdown-sort-category-paragraph
                          "
                        >
                          Low to high
                        </p>
                      </label>
                      <label
                        className="search-page__dropdown-sort-category-radio"
                      >
                        <RadioInput
                          name="sort"
                          checked={directionSort === 'DESC'
                            && propertySort === 'price'}
                          disabled={searchBy === 'master'}
                          onChange={() => handleChangeSort('DESC', 'price')}
                        />
                        <p className="
                          search-page__dropdown-sort-category-paragraph
                          "
                        >
                          High to low
                        </p>
                      </label>
                    </div>
                    <div className="search-page__dropdown-sort-category">
                      <small
                        className="search-page__dropdown-sort-category-title"
                      >
                        Rating:
                      </small>
                      <label
                        className="search-page__dropdown-sort-category-radio"
                      >
                        <RadioInput
                          name="sort"
                          checked={directionSort === 'ASC'
                            && propertySort === 'rating'}
                          onChange={() => handleChangeSort('ASC', 'rating')}
                        />
                        <p className="
                          search-page__dropdown-sort-category-paragraph
                          "
                        >
                          Low to high
                        </p>
                      </label>
                      <label
                        className="search-page__dropdown-sort-category-radio"
                      >
                        <RadioInput
                          name="sort"
                          checked={directionSort === 'DESC'
                            && propertySort === 'rating'}
                          onChange={() => handleChangeSort('DESC', 'rating')}
                        />
                        <p className="
                          search-page__dropdown-sort-category-paragraph
                          "
                        >
                          High to low
                        </p>
                      </label>
                    </div>
                  </div>

                  <hr className="search-page__dropdown-hr" />

                  <div className="search-page__dropdown-buttons">
                    <DropDownButton
                      size="small"
                      placeholder="Clean"
                      className="search-page__dropdown-button"
                      onClick={clearSortBy}
                    />
                    <Button
                      size="small"
                      className="search-page__dropdown-button"
                      onClick={() => setActiveDropDown(null)}
                    >
                      Apply
                    </Button>
                  </div>
                </article>
              </CreateModal>
            )}
          </>
        </div>
      </form>

      <div className="search-page__info">
        <p
          className="search-page__info-clear-everything"
          onClick={handleClearEverything}
        >
          Clear everything
        </p>

        {((searchBy === 'master' && !!masterCards?.content.length)
          || (searchBy === 'servicecard' && !!serviceCards?.content.length)) ? (
            <p className="search-page__info-recommendations">
              Recommendations for you
            </p>
          ) : (
            <p className="search-page__info-not-found">
              Not found
            </p>
          )}

      </div>

      {searchBy === 'master' ? !!masterCards?.content.length && (

        <div className="search-page__cards">
          {masterCards?.content.map(card => {
            return (
              <MasterCard master={card} key={card.id} />
            );
          })}
        </div>
      ) : !!serviceCards?.content.length && (
        <div className="search-page__cards">
          {serviceCards?.content.map(card => {
            return (
              <ServiceCard service={card} key={card.id} />
            );
          })}
        </div>
      )}

      {((searchBy === 'master' && !!masterCards?.content.length)
        || (searchBy === 'servicecard' && !!serviceCards?.content.length)) && (
        <Pagination
          maxLength={7}
          lastPage={searchBy === 'master'
            ? (masterCards?.totalPages && masterCards?.totalPages) || 0
            : (serviceCards?.totalPages && serviceCards?.totalPages) || 0}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}

    </main>
  );
};
