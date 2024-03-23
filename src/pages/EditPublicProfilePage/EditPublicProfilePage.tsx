import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
import { useMediaQuery, useOnClickOutside } from 'usehooks-ts';
import { Transition } from 'history';
import { convertSpaceToHyphen }
  from '../../helpers/functions';
import { DropDownButton } from '../../components/DropDownButton/DropDownButton';
import styleVariables from '../../styles/variables.module.scss';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  deleteMaster,
  getEditMaster,
  hideMaster,
  putEditMaster,
  unhideMaster,
} from '../../api/master';
import { showNotification } from '../../helpers/notifications';
import * as createMasterSlice from '../../features/createMasterSlice';
import iconBasket from '../../img/icons/icon-basket.svg';
import { Button } from '../../components/Button/Button';
import { CreateModal } from '../../components/CreateModal/CreateModal';
import { ModalAlertMessage }
  from '../../components/ModalAlertMessage/ModalAlertMessage';
import * as userSlice from '../../features/userSlice';
import './EditPublicProfilePage.scss';
import { browserHistory } from '../../utils/history';

const navButtons
  = ['Area of work', 'Contacts', 'Address', 'Gallery', 'Services'];

type ActiveModal = '' | 'deleteMaster' | 'hideMaster' | 'blockedURL';

export const EditPublicProfilePage: React.FC = () => {
  const { user } = useAppSelector(state => state.userSlice);
  const createMaster = useAppSelector(state => state.createMasterSlice);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery(`(min-width: ${styleVariables['desktop-min-width']})`);
  const [activeNavButton, setActiveNavButton] = useState(navButtons[0]);
  const [activeModal, setActiveModal] = useState<ActiveModal>('');
  const [isBlockedURL, setIsBlockedURL] = useState(true);
  const [browserBlock, setBrowserBlock]
    = useState<Generator<undefined, void, unknown> | null>(null);
  const [isEditFormShown, setIsEditFormShown] = useState(false);
  const accountContentTitle
    = document.querySelector('.account-page__main-title-wrapper');
  const alertRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(alertRef, () => {
    setActiveModal('');
  });

  const createBrowserBlock = (tx: Transition, unblock: () => void) => {
    const saveTx = tx;
    const saveUnBlock = unblock;

    // eslint-disable-next-line generator-star-spacing, func-names
    return function*() {
      setActiveModal('blockedURL');
      yield;
      saveUnBlock();
      saveTx.retry();
    };
  };

  useEffect(() => {
    if (browserBlock) {
      browserBlock.next();
    }
  }, [browserBlock]);

  useEffect(() => {
    if (!isBlockedURL && browserBlock) {
      browserBlock.next();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBlockedURL]);

  useEffect(() => {
    let unblock: () => void | undefined;

    if (createMaster.editMode) {
      unblock = browserHistory
        .block((tx) => {
          setBrowserBlock(createBrowserBlock(tx, unblock));
        });
    }

    return () => {
      if (unblock) {
        unblock();
      }
    };
  }, [createMaster.editMode]);

  useEffect(() => {
    if (user.master) {
      getEditMaster()
        .then(res => {
          dispatch(createMasterSlice.editMaster({
            firstName: res.firstName,
            lastName: res.lastName,
            contacts: {
              instagram: res.contacts.instagram,
              facebook: res.contacts.facebook,
              telegram: res.contacts.telegram,
              phone: res.contacts.phone,
            },
            address: {
              city: res.address.city,
              street: res.address.street,
              houseNumber: res.address.houseNumber,
              description: res.address.description,
            },
            description: res.description,
            subcategories: res.subcategories,
          }));
          dispatch(createMasterSlice.editOptions({
            hidden: res.hidden,
            masterId: res.id,
          }));
          setIsEditFormShown(true);
        })
        .catch(() => showNotification('error'));
    }

    window.onbeforeunload = (e) => {
      if (e) {
        // eslint-disable-next-line no-param-reassign
        e.returnValue = 'Sure?';
      }

      return 'Sure?';
    };

    return () => {
      window.onbeforeunload = null;

      dispatch(createMasterSlice.deleteMaster());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setNavLinkClassName = (isActive: boolean, button: string) => {
    if (isActive) {
      setActiveNavButton(button);
    }

    return classNames(
      'edit-public-profile-page__nav-link',
      {
        'edit-public-profile-page__nav-link--active': isActive,
      },
    );
  };

  const handleHideProfile = () => {
    setActiveModal('');
    if (createMaster.hidden) {
      unhideMaster()
        .then(() => dispatch(createMasterSlice.editOptions({
          hidden: !createMaster.hidden,
        })))
        .catch(() => showNotification('error'));
    } else {
      hideMaster()
        .then(() => dispatch(createMasterSlice.editOptions({
          hidden: !createMaster.hidden,
        })))
        .catch(() => showNotification('error'));
    }
  };

  const handleDeleteMaster = () => {
    deleteMaster()
      .then(() => {
        dispatch(createMasterSlice.deleteMaster());
        dispatch(userSlice.deleteMaster());
        navigate('..');
      })
      .catch(() => showNotification('error'));
  };

  const toggleEdit = () => {
    dispatch(createMasterSlice.editOptions({
      editMode: !createMaster.editMode,
    }));
  };

  const handleSaveChanges = () => {
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
        setIsBlockedURL(false);
        setActiveModal('');
      })
      .catch(() => {
        showNotification('error');
      });
  };

  const handleDeleteChanges = () => {
    setIsBlockedURL(false);
  };

  return (
    <div className="edit-public-profile-page">
      {activeModal === 'blockedURL' && (
        <CreateModal>
          <ModalAlertMessage
            ref={alertRef}
            title="If you cancel editing, all changes will not be saved"
            dangerPlaceholder="Save changes"
            simplePlaceholder="Cancel"
            onClickDanger={handleSaveChanges}
            onClickSimple={handleDeleteChanges}
            onClose={() => setActiveModal('')}
          />
        </CreateModal>
      )}
      {accountContentTitle && user.master && createPortal(
        <div className="edit-public-profile-page__controls">
          <DropDownButton
            // eslint-disable-next-line max-len
            className="edit-public-profile-page__controls-btn edit-public-profile-page__controls-btn--small"
            size="large"
            onClick={() => setActiveModal('deleteMaster')}
          >
            <img src={iconBasket} alt="delete master" />
          </DropDownButton>
          <DropDownButton
            className="edit-public-profile-page__controls-btn"
            size="large"
            onClick={() => setActiveModal('hideMaster')}
            placeholder={createMaster.hidden
              ? 'Show profile'
              : 'Hide profile'}
          />
          <DropDownButton
            className="edit-public-profile-page__controls-btn"
            size="large"
            placeholder="Preview"
            onClick={() => navigate(`/master/${createMaster.masterId}`)}
          />
          {!createMaster.editMode && (
            <Button
              className="edit-public-profile-page__controls-btn"
              size="small"
              onClick={toggleEdit}
            >
              Edit
            </Button>
          )}
          <>
            {activeModal === 'hideMaster' && (
              <CreateModal>
                <ModalAlertMessage
                  ref={alertRef}
                  onClose={() => setActiveModal('')}
                  title={createMaster.hidden
                    // eslint-disable-next-line max-len
                    ? 'If you click Unhide, the profile will be visible to other users'
                    // eslint-disable-next-line max-len
                    : 'If you click Hide, the profile will not be visible to other users'}
                  dangerPlaceholder={createMaster.hidden
                    ? 'Unhide profile'
                    : 'Hide profile'}
                  onClickDanger={handleHideProfile}
                />
              </CreateModal>
            )}
            {activeModal === 'deleteMaster' && (
              <CreateModal>
                <ModalAlertMessage
                  ref={alertRef}
                  onClose={() => setActiveModal('')}
                  // eslint-disable-next-line max-len
                  title="Are you sure you want to delete your public profile permanently? (recovery is not possible)"
                  dangerPlaceholder="Delete profile"
                  onClickDanger={handleDeleteMaster}
                />
              </CreateModal>
            )}
          </>
        </div>,
        accountContentTitle,
      )}
      <nav className="edit-public-profile-page__nav">
        {navButtons.map((button, index) => (
          <React.Fragment key={button}>
            <NavLink
              className={({ isActive }) => {
                return setNavLinkClassName(isActive, button);
              }}
              to={`./${convertSpaceToHyphen(button)}`}
              style={(!user.master && index > 2)
                || (user.master
                    && createMaster.master.subcategories?.length === 0
                    && index > 2)
                ? { pointerEvents: 'none' }
                : {}}
            >
              <DropDownButton
                placeholder={`${index + 1}${(isDesktop || activeNavButton === button) ? ` ${button}` : ''}`}
                size="small"
                className="edit-public-profile-page__nav-link-btn"
              />
            </NavLink>

            {navButtons.length - 2 >= index && (
              <hr className="edit-public-profile-page__nav-hr" />
            )}
          </React.Fragment>
        ))}
      </nav>

      {isEditFormShown && (
        <Outlet />
      )}

    </div>
  );
};
