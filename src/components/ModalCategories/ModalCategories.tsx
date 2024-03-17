/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { forwardRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import { getCategories } from '../../api/categories';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import { Checkbox } from '../Checkbox/Checkbox';
import { Button } from '../Button/Button';
import { Category, SubCategory } from '../../types/category';
import './ModalCategories.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onClickCategory?: (category: Category | null) => void
  activeCategory?: Category | null
  activeSubcategories?: SubCategory['id'][]
  onApply?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onClean?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onClickSubcategory?: (subCategory: SubCategory, checked: boolean,) => void
  className?: string
  children?: React.ReactNode;
  subCategoriesStyle?: 'column' | 'row'
}

export const ModalCategories = forwardRef<HTMLDivElement, Props>(({
  onClickCategory = () => { },
  activeCategory = null,
  activeSubcategories = [],
  onApply = () => { },
  onClickSubcategory = () => { },
  onClean = () => { },
  className = '',
  children,
  subCategoriesStyle = 'column',
  ...rest
}, ref) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryDefault, setActiveCategoryDefault]
    = useState<Category | null>(activeCategory);

  useIsomorphicLayoutEffect(() => {
    getCategories()
      .then(res => {
        setCategories(res);
      });
  }, []);

  useEffect(() => {
    setActiveCategoryDefault(activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    onClickCategory(activeCategoryDefault);
  }, [activeCategoryDefault, onClickCategory]);

  const handleClickCategory = (category: Category | null) => {
    setActiveCategoryDefault(c => (c?.id === category?.id ? null : category));
  };

  return (
    <article
      className={`modal-categories ${className}`}
      ref={ref}
      {...rest}
    >
      {children}

      <div className="modal-categories__dropdown-categories-main">
        <div className="modal-categories__dropdown-categories-buttons">
          {categories.map((category) => {
            const { id, name } = category;

            return (
              <DropDownButton
                className="modal-categories__dropdown-categories-main-button"
                size="small"
                icon
                key={id}
                placeholder={name}
                active={activeCategoryDefault?.id === category.id}
                onClick={() => handleClickCategory(category)}
              />
            );
          })}
        </div>

        {activeCategoryDefault && !!activeCategoryDefault.subcategories
          && (
            <ul
              className={classNames(
                'modal-categories__dropdown-subcategories',
                {
                  'modal-categories__dropdown-subcategories--row':
                    subCategoriesStyle === 'row',
                },
              )}
            >
              {activeCategoryDefault.subcategories.map((subcategory) => {
                const isSubcategoryChecked
                  = activeSubcategories.some(
                    (id) => +id === subcategory.id,
                  );

                return (
                  <li
                    className="modal-categories__dropdown-subcategory-item"
                    key={subcategory.id}
                  >
                    <label className="modal-categories__dropdown-subcategory">
                      <Checkbox
                        className="
                            modal-categories__dropdown-subcategory-check
                          "
                        checked={isSubcategoryChecked}
                        onChange={(e) => onClickSubcategory(
                          subcategory,
                          e.target.checked,
                        )}
                      />
                      {subcategory.name}
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
      </div>

      <hr className="modal-categories__dropdown-hr" />

      <div className="modal-categories__dropdown-buttons">
        <DropDownButton
          size="small"
          placeholder="Clean"
          className="modal-categories__dropdown-button"
          onClick={onClean}
        />
        <Button
          size="small"
          className="modal-categories__dropdown-button"
          onClick={onApply}
        >
          Apply
        </Button>
      </div>
    </article>
  );
});
