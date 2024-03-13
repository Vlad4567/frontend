/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { forwardRef, useEffect, useState } from 'react';
import { getCategories } from '../../api/categories';

import { DropDownButton } from '../DropDownButton/DropDownButton';
import { Checkbox } from '../Checkbox/Checkbox';
import { Button } from '../Button/Button';
import { Category, SubCategory } from '../../types/category';
import closeIcon from '../../img/icons/icon-dropdown-close.svg';
import './ModalCategories.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  description?: string
  onClickCategory?: (category: Category | null) => void
  activeCategory: Category | null
  activeSubcategories?: SubCategory['id'][]
  onApply?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onClose?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void
  onClean?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onClickSubcategory?: (subCategory: SubCategory, checked: boolean,) => void
}

export const ModalCategories = forwardRef<HTMLDivElement, Props>(({
  description = '',
  onClickCategory = () => { },
  activeCategory,
  activeSubcategories = [],
  onApply = () => { },
  onClickSubcategory = () => { },
  onClose = () => { },
  onClean = () => { },
  ...rest
}, ref) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories()
      .then(res => {
        setCategories(res);
      });
  }, []);

  return (
    <article
      className="modal-categories__categories"
      ref={ref}
      {...rest}
    >
      {description ? (
        <small className="modal-categories__description">
          Select your area of work (min - 1, max -5)
        </small>
      ) : (
        <div className="modal-categories__dropdown-header">
          <h3 className="modal-categories__dropdown-header-title">
            Category
          </h3>
          <img
            alt="close"
            className="modal-categories__dropdown-header-close-icon"
            src={closeIcon}
            onClick={onClose}
          />
        </div>
      )}

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
                active={activeCategory?.id === category.id}
                onClick={() => onClickCategory(category)}
              />
            );
          })}
        </div>

        {activeCategory && !!activeCategory.subcategories
          && (
            <ul className="modal-categories__dropdown-subcategories">
              {activeCategory.subcategories.map((subcategory) => {
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
