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
import {
  addMasterSubcategory,
  deleteMasterSubcategory,
  putEditMaster,
} from '../../api/master';
import * as notificationSlice from '../../features/notificationSlice';
import { SubCategory } from '../../types/category';

type ActiveModal = '' | 'subcategories' | 'cleanMaster';

export const EditAreaOfWork: React.FC = () => {
  const { user } = useAppSelector(state => state.userSlice);
  const createMaster = useAppSelector(state => state.createMasterSlice);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<ActiveModal>('');
  const modalCategoriesRef = useRef<HTMLDivElement>(null);

  const handleOnClickOutside = () => setActiveModal('');

  useOnClickOutside(modalCategoriesRef, handleOnClickOutside);

  const handleCancel = () => {
    if (createMaster.editMode) {
      dispatch(createMasterSlice.deleteMaster());
      dispatch(createMasterSlice.updateEditMaster());
    } else {
      navigate('..');
    }
  };

  const handleInputChange = (
    e:
    | React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    dispatch(createMasterSlice.editMaster({
      [e.target.name]: e.target.value || null,
    }));
  };

  const handleClickSubcategory = (item: SubCategory) => {
    if (user.master) {
      if (createMaster.master.subcategories?.find(sub => sub.id === item.id)) {
        deleteMasterSubcategory(item.id)
          .then(() => {
            dispatch(
              createMasterSlice.toggleSubcategory(item),
            );
          })
          .catch(() => dispatch(notificationSlice.addNotification({
            id: +new Date(),
            type: 'error',
          })));
      } else {
        addMasterSubcategory(item.id)
          .then(() => {
            dispatch(
              createMasterSlice.toggleSubcategory(item),
            );
          })
          .catch(() => dispatch(notificationSlice.addNotification({
            id: +new Date(),
            type: 'error',
          })));
      }
    } else {
      dispatch(
        createMasterSlice.toggleSubcategory(item),
      );
    }
  };

  const handleSubmit = () => {
    if (createMaster.editMode) {
      putEditMaster({
        ...createMaster.master,
        address: {
          ...createMaster.master.address,
          cityId: createMaster.master.address.city?.id || null,
        },
        subcategories:
          createMaster.master.subcategories?.map(item => item.id) || null,
      })
        .then(() => {
          dispatch(createMasterSlice.editOptions({
            editMode: false,
          }));
        })
        .catch(() => dispatch(notificationSlice.addNotification({
          id: +new Date(),
          type: 'error',
        })));
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
        <h3 className="edit-area-of-work__title">
          Area of work
        </h3>

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

          <div
            className="edit-area-of-work__description-subcategories-wrapper"
          >
            {createMaster.master.subcategories && (
              <small
                className="edit-area-of-work__description-subcategories-title"
              >
                Category
              </small>
            )}
            <div className="edit-area-of-work__description-subcategories">
              {createMaster.master.subcategories?.map(item => (
                <DropDownButton
                  key={item.id}
                  icon={!user.master
                    || (user.master && createMaster.editMode)}
                  input={!user.master
                    || (user.master && createMaster.editMode)}
                  active={!user.master
                    || (user.master && createMaster.editMode)}
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
                    onClean={() => dispatch(
                      createMasterSlice
                        .editMaster({ subcategories: null }),
                    )}
                    onApply={handleOnClickOutside}
                    onClickSubcategory={handleClickSubcategory}
                    activeSubcategories={createMaster
                      .master
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
            {
              createMaster.editMode
                ? 'Save changes'
                : 'Continue'
            }
          </Button>
        </div>
      )}
    </>
  );
};
