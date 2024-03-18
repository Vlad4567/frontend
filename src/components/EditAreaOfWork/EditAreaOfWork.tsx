import React, { useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '../Textarea/Textarea';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import { LoginInput } from '../LoginInput/LoginInput';
import { Button } from '../Button/Button';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import * as createMasterSlice from '../../features/createMasterSlice';
import { ModalCategories } from '../ModalCategories/ModalCategories';
import { CreateModal } from '../CreateModal/CreateModal';
import './EditAreaOfWork.scss';

export const EditAreaOfWork: React.FC = () => {
  const dispatch = useAppDispatch();
  const createMaster = useAppSelector(state => state.createMasterSlice);
  const navigate = useNavigate();
  const [isModalCategoriesOpen, setIsModalCategoriesOpen] = useState(false);
  const modalCategoriesRef = useRef<HTMLDivElement>(null);

  const handleOnClickOutside = () => setIsModalCategoriesOpen(false);

  useOnClickOutside(modalCategoriesRef, handleOnClickOutside);

  const handleCancel = () => {
    dispatch(createMasterSlice.editCreateMaster({
      firstName: null,
      lastName: null,
      description: null,
      subcategories: null,
    }));
  };

  const handleInputChange = (
    e:
    | React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    dispatch(createMasterSlice.editCreateMaster({
      [e.target.name]: e.target.value || null,
    }));
  };

  return (
    <>
      <form className="edit-area-of-work__form">
        <h3 className="edit-area-of-work__title">
          Area of work
        </h3>

        <div className="edit-area-of-work__name">
          <LoginInput
            title="Name"
            value={createMaster.firstName || ''}
            onChange={handleInputChange}
            name="firstName"
            placeholder="Enter name"
            className="edit-area-of-work__name-name"
          />

          <LoginInput
            title="Surname"
            value={createMaster.lastName || ''}
            onChange={handleInputChange}
            name="lastName"
            placeholder="Enter surname"
            className="edit-area-of-work__name-surname"
          />
        </div>

        <div className="edit-area-of-work__description">
          <Textarea
            title="About you"
            // eslint-disable-next-line max-len
            placeholder="Enter information about yourself, such as work experience, training certificates, etc."
            value={createMaster.description || ''}
            onChange={handleInputChange}
            name="description"
            className="edit-area-of-work__description-textarea"
            autoGrow
          />

          <div
            className="edit-area-of-work__description-subcategories-wrapper"
          >
            {createMaster.subcategories && (
              <small
                className="edit-area-of-work__description-subcategories-title"
              >
                Category
              </small>
            )}
            <div className="edit-area-of-work__description-subcategories">
              {createMaster.subcategories?.map(item => (
                <DropDownButton
                  key={item.id}
                  icon
                  input
                  active
                  size="large"
                  className="edit-area-of-work__description-subcategory"
                  onClick={() => dispatch(
                    createMasterSlice.deleteSubcategory(item.id),
                  )}
                >
                  {item.name}
                </DropDownButton>
              ))}

              <DropDownButton
                size="large"
                placeholder="+ Add area of work"
                className="edit-area-of-work__description-add-area-of-work"
                onClick={() => setIsModalCategoriesOpen(c => !c)}
              />

              {isModalCategoriesOpen && (
                <CreateModal>
                  <ModalCategories
                    subCategoriesStyle="row"
                    onClean={() => dispatch(
                      createMasterSlice
                        .editCreateMaster({ subcategories: null }),
                    )}
                    onApply={handleOnClickOutside}
                    onClickSubcategory={item => dispatch(
                      createMasterSlice.toggleSubcategory(item),
                    )}
                    activeSubcategories={createMaster
                      .subcategories
                      ?.map(item => item.id) || []}
                    className="edit-area-of-work__description-modal-categories"
                    ref={modalCategoriesRef}
                  >
                    <small
                      className="
                        edit-area-of-work__description-categories-title
                      "
                    >
                      Select your area of work
                    </small>
                  </ModalCategories>
                </CreateModal>
              )}
            </div>
          </div>
        </div>
      </form>
      <div className="edit-area-of-work__controls">
        <DropDownButton
          placeholder="Cancel"
          size="large"
          className="edit-area-of-work__controls-button"
          onClick={handleCancel}
        />

        <Button
          size="small"
          className="edit-area-of-work__controls-button"
          onClick={() => navigate('../contacts')}
        >
          Continue
        </Button>
      </div>
    </>
  );
};
