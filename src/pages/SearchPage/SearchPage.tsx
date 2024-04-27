/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery, useOnClickOutside } from 'usehooks-ts';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import { CreateModal } from '../../components/CreateModal';
import { DropDownButton } from '../../components/DropDownButton/DropDownButton';
import { DropDownSortButton } from '../../components/DropDownSortButton';
import { FilterSearchInput } from '../../components/FilterSearchInput/FilterSearchInput';
import { RadioInput } from '../../components/RadioInput/RadioInput';
import closeIcon from '../../img/icons/icon-dropdown-close.svg';
import { Category, SubCategory } from '../../types/category';
import { tailwindConfig } from '../../helpers/variables';
import {
  getFilteredMasterCards,
  getFilteredServiceCards,
} from '../../api/searchPage';
import { ActiveDropDown, City } from '../../types/searchPage';
import { getSearchWith } from '../../helpers/functions';
import { SearchWithParams } from '../../types/main';
import { MasterCard } from '../../components/MasterCard/MasterCard';
import { ServiceCard } from '../../components/ServiceCard/ServiceCard';
import { UnderlinedSmall } from '../../components/UnderlinedSmall/UnderlinedSmall';
import { ModalCategories } from '../../components/ModalCategories/ModalCategories';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCities } from '../../hooks/useCities';
import './SearchPage.scss';

type TypeCard = 'master' | 'service';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const directionSort = searchParams.get('direction') || '';
  const propertySort = searchParams.get('property') || '';

  searchParams.sort();

  const [activeDropDown, setActiveDropDown] = useState<ActiveDropDown | null>(
    null,
  );
  const {
    cities: { data: cityList },
    cityValue,
    setCityValue,
  } = useCities();
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [searchBy, setSearchBy] = useState<TypeCard>('service');

  const isShownModalCityInput = useMediaQuery(
    `(max-width: ${tailwindConfig.theme.screens.lg})`,
  );

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

  const closeDropdowns = () => {
    setActiveDropDown(null);
  };

  useOnClickOutside<HTMLDivElement | HTMLButtonElement>(
    [
      dropDownRef,
      cityButtonRef,
      categoryButtonRef,
      priceButtonRef,
      sortButtonRef,
    ],
    closeDropdowns,
  );

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

  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleChooseSubCategory = (
    subcategory: SubCategory,
    checked: boolean,
  ) => {
    const convertedSubcategories = searchParams
      .getAll('subcategories')
      .map(Number);

    const newSubcategories =
      convertedSubcategories.includes(subcategory.id) && !checked
        ? convertedSubcategories.filter(id => id !== subcategory.id)
        : [...convertedSubcategories, subcategory.id];

    setSearchWith({ subcategories: newSubcategories });
  };

  const handleClearEverything = () => {
    setSearchParams(new URLSearchParams());

    setCityValue('');
    closeDropdowns();
    setActiveCategory(null);
  };

  const { data: masterCards, fetchNextPage: fetchFilteredMasterCardsNextPage } =
    useInfiniteQuery({
      queryKey: [`filteredMasterCards`, 16, searchParams.toString(), searchBy],
      queryFn: ({ pageParam = 0 }) =>
        searchBy === 'master'
          ? getFilteredMasterCards(pageParam, 16, searchParams.toString())
          : undefined,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage?.last) {
          return undefined;
        }

        return pages.length;
      },
      initialPageParam: 0,
    });

  const {
    data: serviceCards,
    fetchNextPage: fetchFilteredServiceCardsNextPage,
  } = useInfiniteQuery({
    queryKey: ['filteredServiceCards', 16, searchParams.toString(), searchBy],
    queryFn: ({ pageParam = 0 }) =>
      searchBy === 'service'
        ? getFilteredServiceCards(pageParam, 16, searchParams.toString())
        : undefined,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.last) {
        return undefined;
      }

      return pages.length;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    const createdObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchFilteredMasterCardsNextPage();
        fetchFilteredServiceCardsNextPage();
      }
    });

    createdObserver.observe(observeRef.current as HTMLDivElement);

    return () => createdObserver.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            onChange={e => setSearchWith({ text: e.target.value })}
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
                  style={
                    !isShownModalCityInput && !cityList.length
                      ? { display: 'none' }
                      : {}
                  }
                  ref={dropDownRef}
                >
                  <div className="search-page__dropdown-header">
                    <h3 className="search-page__dropdown-header-title">City</h3>
                    <img
                      src={closeIcon}
                      alt="close"
                      className="search-page__dropdown-header-close-icon"
                      onClick={closeDropdowns}
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
                      onClick={closeDropdowns}
                    />
                  </div>
                  <div className="search-page__dropdown-price-range-main">
                    <div className="search-page__dropdown-price-range-wraper">
                      <small
                        className="
                        search-page__dropdown-price-range-parameter
                        "
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
                        className="
                        search-page__dropdown-price-range-parameter
                        "
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
                  onClean={() => setSearchWith({ subcategories: null })}
                  onClickSubcategory={handleChooseSubCategory}
                  activeSubcategories={searchParams
                    .getAll('subcategories')
                    .map(Number)}
                >
                  <div className="search-page__dropdown-categories-header">
                    <h3 className="search-page__dropdown-categories-title">
                      Category
                    </h3>
                    <img
                      alt="close"
                      className="search-page__dropdown-categories-icon"
                      src={closeIcon}
                      onClick={closeDropdowns}
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
                  onClick={e => e.stopPropagation()}
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
                      onClick={closeDropdowns}
                    />
                  </div>
                  <div className="search-page__dropdown-sort-categories">
                    <div className="search-page__dropdown-sort-category">
                      <small
                        className="
                        search-page__dropdown-sort-category-title
                        "
                      >
                        Price:
                      </small>
                      <label
                        className="
                        search-page__dropdown-sort-category-radio
                        "
                      >
                        <RadioInput
                          name="sort"
                          checked={
                            directionSort === 'ASC' && propertySort === 'price'
                          }
                          disabled={searchBy === 'master'}
                          onChange={() => handleChangeSort('ASC', 'price')}
                        />
                        <p
                          className="
                          search-page__dropdown-sort-category-paragraph
                          "
                        >
                          Low to high
                        </p>
                      </label>
                      <label
                        className="
                        search-page__dropdown-sort-category-radio
                        "
                      >
                        <RadioInput
                          name="sort"
                          checked={
                            directionSort === 'DESC' && propertySort === 'price'
                          }
                          disabled={searchBy === 'master'}
                          onChange={() => handleChangeSort('DESC', 'price')}
                        />
                        <p
                          className="
                          search-page__dropdown-sort-category-paragraph
                          "
                        >
                          High to low
                        </p>
                      </label>
                    </div>
                    <div className="search-page__dropdown-sort-category">
                      <small
                        className="
                        search-page__dropdown-sort-category-title
                        "
                      >
                        Rating:
                      </small>
                      <label
                        className="
                        search-page__dropdown-sort-category-radio
                        "
                      >
                        <RadioInput
                          name="sort"
                          checked={
                            directionSort === 'ASC' && propertySort === 'rating'
                          }
                          onChange={() => handleChangeSort('ASC', 'rating')}
                        />
                        <p
                          className="
                          search-page__dropdown-sort-category-paragraph
                          "
                        >
                          Low to high
                        </p>
                      </label>
                      <label
                        className="
                        search-page__dropdown-sort-category-radio
                        "
                      >
                        <RadioInput
                          name="sort"
                          checked={
                            directionSort === 'DESC' &&
                            propertySort === 'rating'
                          }
                          onChange={() => handleChangeSort('DESC', 'rating')}
                        />
                        <p
                          className="
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
                      onClick={() =>
                        setSearchWith({ direction: null, property: null })
                      }
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

        {(searchBy === 'master' && !!masterCards?.pages[0]?.content.length) ||
        (searchBy === 'service' && !!serviceCards?.pages[0]?.content.length) ? (
          <p className="search-page__info-recommendations">
            Recommendations for you
          </p>
        ) : (
          <p className="search-page__info-not-found">Not found</p>
        )}
      </div>

      {searchBy === 'master'
        ? !!masterCards?.pages[0]?.content.length && (
            <div className="search-page__cards">
              {masterCards?.pages.flatMap(page =>
                page?.content.map(card => (
                  <MasterCard master={card} key={card.id} />
                )),
              )}
            </div>
          )
        : !!serviceCards?.pages[0]?.content.length && (
            <div className="search-page__cards">
              {serviceCards?.pages.flatMap(page =>
                page?.content.map(card => (
                  <ServiceCard service={card} key={card.id} />
                )),
              )}
            </div>
          )}

      <div ref={observeRef} />
    </main>
  );
};
