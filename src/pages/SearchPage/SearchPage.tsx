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
import closeIcon from '../../img/icons/icon-dropdown-close.svg';
import { Category, SubCategory } from '../../types/category';
import variables from '../../styles/variables.module.scss';
import { debounceDelay } from '../../helpers/variables';
import {
  getCities,
  getFilteredMasterCards,
  getFilteredServiceCards,
} from '../../api/searchPage';
import { ActiveDropDown, City } from '../../types/searchPage';
import { getSearchWith } from '../../helpers/functions';
import * as typesMaster from '../../types/master';
import { Page, TypeCard, SearchWithParams } from '../../types/main';
import { MasterCard } from '../../components/MasterCard/MasterCard';
import { ServiceCard } from '../../components/ServiceCard/ServiceCard';
import { UnderlinedSmall }
  from '../../components/UnderlinedSmall/UnderlinedSmall';
import { ModalCategories }
  from '../../components/ModalCategories/ModalCategories';
import './SearchPage.scss';
import * as notificationSlice from '../../features/notificationSlice';
import { useAppDispatch } from '../../app/hooks';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const directionSort = searchParams.get('direction') || '';
  const propertySort = searchParams.get('property') || '';

  const [activeDropDown, setActiveDropDown]
    = useState<ActiveDropDown | null>(null);
  const [cityValue, setCityValue] = useState('');
  const [cityList, setCityList] = useState<City[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [searchBy, setSearchBy] = useState<TypeCard>('service');
  const [masterCards, setMasterCards]
    = useState<Page<typesMaster.MasterCard> | null>(null);
  const [serviceCards, setServiceCards]
    = useState<Page<typesMaster.ServiceCard> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);

  const isShownModalCityInput = useMediaQuery(`(max-width: ${variables['tablet-min-width']})`);
  const debouncedCity = useDebounce<string>(cityValue, debounceDelay);
  const debouncedSearchParams = useDebounce(searchParams, debounceDelay);

  const cityInputRef = useRef<HTMLInputElement>(null);
  const cityButtonRef = useRef<HTMLButtonElement>(null);
  const categoryButtonRef = useRef<HTMLButtonElement>(null);
  const priceButtonRef = useRef<HTMLButtonElement>(null);
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const observeRef = useRef<HTMLDivElement>(null);

  const setSearchWith = (params: SearchWithParams) => {
    const search = getSearchWith(params, searchParams);

    setSearchParams(search);
  };

  const handleClickOutside = () => {
    setActiveDropDown(null);
  };

  useOnClickOutside<HTMLDivElement | HTMLButtonElement>([
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

  const handleInputCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setSearchWith({ city: null });
    }

    setCityValue(e.target.value);
  };

  const handleCityIcon = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    setCityValue('');
    setSearchWith({ city: null });
  };

  const handleChooseCity = (item: City) => {
    setCityValue(item.name);

    setSearchWith({ city: item.id });

    setActiveDropDown(null);
  };

  const handleChangePrice = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const inputValue = e.target.value
      .replace(/\b0*([1-9]\d*|0)\b/, '$1')
      .replace(/[^\d]/g, '');

    const { name } = e.target;

    if (name === 'minPrice') {
      setSearchWith({ minPrice: inputValue });
    } else if (name === 'maxPrice') {
      setSearchWith({ maxPrice: inputValue });
    }
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
    setMasterCards(null);
    setServiceCards(null);
    setCurrentPage(1);
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

  const clearSubCategories = () => {
    setSearchWith({ subCategories: null });
  };

  const clearSortBy = () => {
    setSearchWith({ direction: null, property: null });
  };

  const handleClearEverything = () => {
    setSearchParams(new URLSearchParams());

    setCityValue('');
    setActiveDropDown(null);
    setActiveCategory(null);
  };

  const loadCardsByPage = (page: number) => {
    switch (searchBy) {
      case 'master':
        getFilteredMasterCards(
          page - 1, 16, debouncedSearchParams.toString(),
        )
          .then((res) => {
            if (page === 1) {
              setMasterCards(res);
            } else {
              setMasterCards(c => (c?.content
                ? {
                  ...res,
                  content: [...c.content, ...res.content],
                }
                : res));
            }

            if (res.last) {
              observer?.disconnect();
            }
          })
          .catch(() => dispatch(notificationSlice.addNotification({
            id: +new Date(),
            type: 'error',
          })));
        break;

      case 'service':
        getFilteredServiceCards(
          page - 1, 16, debouncedSearchParams.toString(),
        )
          .then((res) => {
            if (page === 1) {
              setServiceCards(res);
            } else {
              setServiceCards(c => (c?.content
                ? {
                  ...res,
                  content: [...c.content, ...res.content],
                }
                : res));
            }

            if (res.last) {
              observer?.disconnect();
            }
          })
          .catch(() => dispatch(notificationSlice.addNotification({
            id: +new Date(),
            type: 'error',
          })));
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    setObserver(() => {
      const createdObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage(prev => prev + 1);
        }
      });

      createdObserver.observe(observeRef.current as HTMLDivElement);

      return createdObserver;
    });

    return () => observer?.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchBy, searchParams]);

  useEffect(() => {
    if (debouncedCity) {
      getCities(0, 4, debouncedCity)
        .then(res => setCityList(res.content))
        .catch(() => dispatch(notificationSlice.addNotification({
          id: +new Date(),
          type: 'error',
        })));
    } else {
      setCityList([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    loadCardsByPage(currentPage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    loadCardsByPage(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchParams]);

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
                    onChange={() => handleSearchBy('service')}
                    checked={searchBy === 'service'}
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
            value={searchParams.get('text') || ''}
            onChange={(e) => setSearchWith({ text: e.target.value })}
            className="search-page__filter-input"
            placeholder={
              searchBy === 'service'
                ? 'Enter the name of the service'
                : 'Enter the name of the master'
            }
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
              className="search-page__filter-dropdown-button"
              onClick={() => handleToggleDropDown('City')}
              onChange={handleInputCity}
              ref={cityButtonRef}
            />

            {activeDropDown === 'City' && (
              <CreateModal media={{ onPhone: true }}>
                <article
                  className="search-page__dropdown-city"
                  style={!isShownModalCityInput
                    && !cityList.length ? { display: 'none' } : {}}
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
                    handleIconOnClick={handleCityIcon}
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
                        value={searchParams.get('minPrice') || ''}
                        onChange={handleChangePrice}
                        type="text"
                        name="minPrice"
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
                        value={searchParams.get('maxPrice') || ''}
                        onChange={handleChangePrice}
                        type="text"
                        name="maxPrice"
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
              onClick={() => handleToggleDropDown('Category')}
              ref={categoryButtonRef}
            />

            {activeDropDown === 'Category' && (
              <CreateModal media={{ onPhone: true }}>
                <ModalCategories
                  className="search-page__dropdown-categories"
                  activeCategory={activeCategory}
                  ref={dropDownRef}
                  onClickCategory={setActiveCategory}
                  onApply={() => setActiveDropDown(null)}
                  onClean={clearSubCategories}
                  onClickSubcategory={handleChooseSubCategory}
                  activeSubcategories={searchParams
                    .getAll('subCategories').map(Number)}
                >
                  <div className="search-page__dropdown-categories-header">
                    <h3 className="search-page__dropdown-categories-title">
                      Category
                    </h3>
                    <img
                      alt="close"
                      className="search-page__dropdown-categories-icon"
                      src={closeIcon}
                      onClick={handleClickOutside}
                    />
                  </div>
                </ModalCategories>
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
        <UnderlinedSmall
          tag="p"
          className="search-page__info-clear-everything"
          onClick={handleClearEverything}
        >
          Clear everything
        </UnderlinedSmall>

        {((searchBy === 'master' && !!masterCards?.content.length)
          || (searchBy === 'service' && !!serviceCards?.content.length)) ? (
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

      <div ref={observeRef} />
    </main>
  );
};
