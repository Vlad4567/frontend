import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
import { useMediaQuery, useOnClickOutside } from 'usehooks-ts';
import { Transition } from 'history';
import {
  convertHyphenToSpace,
  convertSpaceToHyphen,
} from '../../helpers/functions';
import { DropDownButton } from '../../components/DropDownButton/DropDownButton';
import styleVariables from '../../styles/variables.module.scss';
import iconBasket from '../../img/icons/icon-basket.svg';
import { Button } from '../../components/Button/Button';
import { CreateModal } from '../../components/CreateModal/CreateModal';
import { ModalAlertMessage } from '../../components/ModalAlertMessage/ModalAlertMessage';
import { browserHistory } from '../../utils/history';
import { useUser } from '../../hooks/useUser';
import { useCreateMaster } from '../../hooks/useCreateMaster';
import './EditPublicProfilePage.scss';

const navButtons = [
  'Area of work',
  'Contacts',
  'Address',
  'Gallery',
  'Services',
];

type ActiveModal = '' | 'deleteMaster' | 'hideMaster' | 'blockedURL';

export const EditPublicProfilePage: React.FC = () => {
  const {
    queryUser: { data: user },
  } = useUser();
  const {
    createMasterData: { data: createMaster },
    deleteMaster,
    editOptions,
    toggleHideProfileMutate,
    saveChanges,
  } = useCreateMaster();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDesktop = useMediaQuery(
    `(min-width: ${styleVariables['desktop-min-width']})`,
  );
  const [activeNavButton, setActiveNavButton] = useState(navButtons[0]);
  const [activeModal, setActiveModal] = useState<ActiveModal>('');
  const [isBlockedURL, setIsBlockedURL] = useState(true);
  const [browserBlock, setBrowserBlock] = useState<Generator<
    undefined,
    void,
    unknown
  > | null>(null);
  const accountContentTitle = document.querySelector(
    '.account-page__main-title-wrapper',
  );
  const alertRef = useRef<HTMLDivElement>(null);
  const pathArray = pathname.split('/');
  const pathAfterEditPublicProfile =
    pathArray[
      pathArray.findIndex(path => path === 'edit-public-profile') + 1
    ] || '';

  useOnClickOutside(alertRef, () => {
    setActiveModal('');
  });

  const createBrowserBlock = (tx: Transition, unblock: () => void) => {
    const saveTx = tx;
    const saveUnBlock = unblock;

    // eslint-disable-next-line generator-star-spacing, func-names
    return function* () {
      setActiveModal('blockedURL');
      yield;
      saveUnBlock();
      window.onbeforeunload = null;
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
      window.onbeforeunload = e => {
        if (e) {
          // eslint-disable-next-line no-param-reassign
          e.returnValue = 'Sure?';
        }

        return 'Sure?';
      };

      unblock = browserHistory.block(tx => {
        setBrowserBlock(createBrowserBlock(tx, unblock));
      });
    }

    return () => {
      if (unblock) {
        unblock();
      }

      window.onbeforeunload = null;
    };
  }, [createMaster.editMode]);

  useEffect(() => {
    if (pathAfterEditPublicProfile === '') {
      navigate('./area-of-work');
    }

    if (!createMaster.editMode) {
      window.onbeforeunload = e => {
        if (e) {
          // eslint-disable-next-line no-param-reassign
          e.returnValue = 'Sure?';
        }

        return 'Sure?';
      };
    }

    return () => {
      window.onbeforeunload = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const button = convertHyphenToSpace(pathAfterEditPublicProfile);

    setActiveNavButton(button);
  }, [pathAfterEditPublicProfile]);

  const setNavLinkClassName = (isActive: boolean) => {
    return classNames('edit-public-profile-page__nav-link', {
      'edit-public-profile-page__nav-link--active': isActive,
    });
  };

  const handleHideProfile = () => {
    toggleHideProfileMutate.mutateAsync().then(() => setActiveModal(''));
  };

  const handleDeleteMaster = () => {
    deleteMaster().then(() => {
      navigate('..');
    });
  };

  const toggleEdit = () => {
    editOptions({
      editMode: !createMaster.editMode,
    });
  };

  const handleSaveChanges = () => {
    saveChanges.mutateAsync().then(() => {
      setIsBlockedURL(false);
      setActiveModal('');
    });
  };

  const handleDeleteChanges = () => {
    editOptions({
      editMode: false,
    });
    setIsBlockedURL(false);
    setActiveModal('');
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
      {accountContentTitle &&
        user.master &&
        createPortal(
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
              placeholder={
                createMaster.hidden ? 'Show profile' : 'Hide profile'
              }
            />
            <DropDownButton
              className="edit-public-profile-page__controls-btn"
              size="large"
              placeholder="Preview"
              onClick={() => navigate(`/master/${createMaster.masterId}`)}
            />
            {!createMaster.editMode &&
              pathAfterEditPublicProfile !== 'gallery' &&
              pathAfterEditPublicProfile !== 'services' && (
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
                    title={
                      createMaster.hidden
                        ? // eslint-disable-next-line max-len
                          'If you click Unhide, the profile will be visible to other users'
                        : // eslint-disable-next-line max-len
                          'If you click Hide, the profile will not be visible to other users'
                    }
                    dangerPlaceholder={
                      createMaster.hidden ? 'Unhide profile' : 'Hide profile'
                    }
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
                return setNavLinkClassName(isActive);
              }}
              to={`./${convertSpaceToHyphen(button)}`}
              style={
                (!user.master && index > 2) ||
                (user.master &&
                  createMaster.master.subcategories?.length === 0 &&
                  index > 2)
                  ? { pointerEvents: 'none' }
                  : {}
              }
            >
              <DropDownButton
                placeholder={`${index + 1}${isDesktop || activeNavButton === button ? ` ${button}` : ''}`}
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

      {(createMaster.editFormShown || !user.master) && <Outlet />}
    </div>
  );
};
