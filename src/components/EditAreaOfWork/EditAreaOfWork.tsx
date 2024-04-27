import React, { useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '../Textarea/Textarea';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import { LoginInput } from '../LoginInput/LoginInput';
import { Button } from '../Button';
import { ModalCategories } from '../ModalCategories/ModalCategories';
import { CreateModal } from '../CreateModal';
import { SubCategory } from '../../types/category';
import { useUser } from '../../hooks/useUser';
import { useCreateMaster } from '../../hooks/useCreateMaster';
import './EditAreaOfWork.scss';

type ActiveModal = '' | 'subcategories' | 'cleanMaster';

export const EditAreaOfWork: React.FC = () => {
  const {
    queryUser: { data: user },
  } = useUser();
  const {
    createMasterData: { data: createMaster, refetch: createMasterRefetch },
    editMaster,
    saveChanges,
    toggleSubcategory,
  } = useCreateMaster();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<ActiveModal>('');
  const modalCategoriesRef = useRef<HTMLDivElement>(null);

  const handleOnClickOutside = () => setActiveModal('');

  useOnClickOutside(modalCategoriesRef, handleOnClickOutside);

  const handleCancel = () => {
    if (createMaster.editMode) {
      createMasterRefetch();
    } else {
      navigate('/account');
    }
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    editMaster({
      [e.target.name]: e.target.value || null,
    });
  };

  const handleClickSubcategory = (item: SubCategory) => {
    toggleSubcategory.mutate(item);
  };

  const handleSubmit = () => {
    if (createMaster.editMode) {
      saveChanges.mutate();
    } else {
      navigate('../contacts');
    }
  };

  return (
    <>
      <form
        className="edit-area-of-work__form"
        style={
          user.master && !createMaster.editMode
            ? {
                pointerEvents: 'none',
              }
            : {}
        }
      >
        <h3 className="edit-area-of-work__title">Area of work</h3>

        <div className="edit-area-of-work__name">
          <LoginInput
            title="Name"
            value={createMaster.master.firstName || ''}
            onChange={handleInputChange}
            name="firstName"
            placeholder="Enter name"
            className="edit-area-of-work__name-name"
          />

          <LoginInput
            title="Surname"
            value={createMaster.master.lastName || ''}
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
            value={createMaster.master.description || ''}
            onChange={handleInputChange}
            name="description"
            className="edit-area-of-work__description-textarea"
            autoGrow
          />

          <div className="edit-area-of-work__description-subcategories-wrapper">
            {createMaster.master.subcategories && (
              <small
                className="
                edit-area-of-work__description-subcategories-title
                "
              >
                Category
              </small>
            )}
            <div className="edit-area-of-work__description-subcategories">
              {createMaster.master.subcategories?.map(item => (
                <DropDownButton
                  key={item.id}
                  icon={!user.master || (user.master && createMaster.editMode)}
                  input={!user.master || (user.master && createMaster.editMode)}
                  active={
                    !user.master || (user.master && createMaster.editMode)
                  }
                  size="large"
                  className="edit-area-of-work__description-subcategory"
                  onClick={() => handleClickSubcategory(item)}
                >
                  {item.name}
                </DropDownButton>
              ))}
              {(!user.master || (user.master && createMaster.editMode)) && (
                <DropDownButton
                  size="large"
                  placeholder="+ Add area of work"
                  className="edit-area-of-work__description-add-area-of-work"
                  onClick={() => setActiveModal('subcategories')}
                />
              )}

              {activeModal === 'subcategories' && (
                <CreateModal>
                  <ModalCategories
                    subCategoriesStyle="row"
                    onClean={() => editMaster({ subcategories: null })}
                    onApply={handleOnClickOutside}
                    onClickSubcategory={handleClickSubcategory}
                    activeSubcategories={
                      createMaster.master.subcategories?.map(item => item.id) ||
                      []
                    }
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
      {(!user.master || (user.master && createMaster.editMode)) && (
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
            onClick={handleSubmit}
          >
            {createMaster.editMode ? 'Save changes' : 'Continue'}
          </Button>
        </div>
      )}
    </>
  );
};
