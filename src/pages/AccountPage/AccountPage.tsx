/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useRef, useState } from 'react';
import {
  useIsomorphicLayoutEffect,
  useMediaQuery,
  useOnClickOutside,
} from 'usehooks-ts';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import defaultAvatar from '../../img/default-avatar.svg';
import avatarEdit from '../../img/icons/icon-pen-edit.svg';
import { DropDownButton } from '../../components/DropDownButton/DropDownButton';
import { tailwindConfig } from '../../helpers/variables';
import { ArrowButton } from '../../components/ArrowButton';
import { convertHyphenToSpace } from '../../helpers/functions';
import { UnderlinedSmall } from '../../components/UnderlinedSmall/UnderlinedSmall';
import telegramIcon from '../../img/icons/icon-telegram.svg';
import { LoginFormTelegram } from '../../components/LoginFormTelegram/LoginFormTelegram';
import { CreateModal } from '../../components/CreateModal';
import { TypeModal } from '../../types/account';
import { ModalAlertMessage } from '../../components/ModalAlertMessage/ModalAlertMessage';
import { useApp } from '../../hooks/useApp';
import { useUser } from '../../hooks/useUser';
import './AccountPage.scss';

export const AccountPage: React.FC = () => {
  const {
    queryUser: { data: user },
    updateProfilePhoto,
    verificationTelegram,
    disconnectTelegram,
    deleteRefreshToken,
  } = useUser();
  const { updateApp } = useApp();
  const pathArray = useLocation().pathname.split('/');
  const currentPath = pathArray[pathArray.length - 1];
  const pathAfterAccount =
    pathArray[pathArray.findIndex(path => path === 'account') + 1] || '';
  const navigate = useNavigate();
  const isNotPhone = useMediaQuery(
    `(min-width: ${tailwindConfig.theme.screens.lg})`,
  );
  const [modal, setModal] = useState<TypeModal | ''>('');
  const modalRef = useRef(null);

  const { telegramAccount } = user;

  useEffect(() => {
    if (currentPath === 'account' && isNotPhone) {
      navigate('personal-details', { replace: true });
    }
  }, [isNotPhone, currentPath, navigate]);

  useIsomorphicLayoutEffect(() => {
    updateApp({ footerShown: false });

    return () => {
      updateApp({ footerShown: true });
    };
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const avatarFile = e.target.files?.item(0);

    if (avatarFile) {
      updateProfilePhoto.mutate(avatarFile);
    }
  };

  const handleTerminateSessions = () => {
    deleteRefreshToken.mutateAsync().then(() => {
      navigate('/login');
    });
  };

  const handleClickOutside = () => {
    setModal('');
  };

  useOnClickOutside<HTMLFormElement>([modalRef], handleClickOutside);

  const handleConnectTelegram = (code: string) => {
    verificationTelegram.mutateAsync(code).then(() => {
      setModal('');
    });
  };

  const handleOpenModal = () => {
    if (telegramAccount?.telegramUsername) {
      setModal('disconnectTelegram');
    } else {
      setModal('formTelegram');
    }
  };

  const handleDisconnectTelegram = () => {
    disconnectTelegram.mutateAsync().then(() => {
      setModal('');
    });
  };

  return (
    <main className="account-page">
      <div className="account-page__header">
        <ArrowButton
          className="account-page__header-back"
          onClick={() => navigate(-1)}
          position="left"
        />

        <h3 className="account-page__header-title">
          {convertHyphenToSpace(pathAfterAccount)}
        </h3>
      </div>

      <div className="account-page__main">
        {((!isNotPhone && currentPath === 'account') || isNotPhone) && (
          <aside className="account-page__menu">
            <label>
              <div className="account-page__menu-avatar">
                <input
                  className="account-page__menu-avatar-input"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  size={5000000}
                />
                <img
                  className="account-page__menu-avatar-img"
                  src={user.profilePhoto || defaultAvatar}
                  alt="Avatar"
                />
                <div className="account-page__menu-avatar-edit">
                  <img
                    className="account-page__menu-avatar-edit-img"
                    src={avatarEdit}
                    alt="Avatar edit"
                  />
                </div>
              </div>
            </label>

            {user.username && (
              <p className="account-page__menu-username">{user.username}</p>
            )}

            <hr className="account-page__menu-hr" />

            <nav className="account-page__menu-nav">
              <ul className="account-page__menu-nav-list">
                <li className="account-page__menu-nav-item">
                  <NavLink
                    to="./personal-details"
                    className={({ isActive }) => {
                      return classNames('account-page__menu-nav-link', {
                        'account-page__menu-nav-link--active': isActive,
                      });
                    }}
                  >
                    <DropDownButton
                      className="account-page__menu-nav-button"
                      size="small"
                      placeholder="Personal details"
                      active={pathAfterAccount === 'personal-details'}
                    />
                  </NavLink>
                </li>
                {(user.master ||
                  pathAfterAccount === 'edit-public-profile') && (
                  <li className="account-page__menu-nav-item">
                    <NavLink
                      to="./edit-public-profile/area-of-work"
                      className={({ isActive }) => {
                        return classNames('account-page__menu-nav-link', {
                          'account-page__menu-nav-link--active': isActive,
                        });
                      }}
                    >
                      <DropDownButton
                        className="account-page__menu-nav-button"
                        size="small"
                        placeholder="Public profile (Master)"
                        active={pathAfterAccount === 'edit-public-profile'}
                      />
                    </NavLink>
                  </li>
                )}
              </ul>
            </nav>

            <hr className="account-page__menu-hr" />

            <div className="account-page__menu-log-out-wrapper">
              <NavLink to="/login" className="account-page__menu-log-out-link">
                <DropDownButton
                  className="account-page__menu-log-out"
                  size="small"
                  icon
                  active
                  placeholder="Log out"
                />
              </NavLink>

              <UnderlinedSmall
                className="account-page__menu-log-out-terminate"
                onClick={handleTerminateSessions}
              >
                Terminate all other sessions
              </UnderlinedSmall>
            </div>
          </aside>
        )}

        {user && (
          <div className="account-page__main-content">
            <div className="account-page__main-title-wrapper">
              <h1 className="account-page__main-title">
                {convertHyphenToSpace(pathAfterAccount)}
              </h1>

              {pathAfterAccount === 'personal-details' && (
                <>
                  <DropDownButton
                    type="submit"
                    size="large"
                    className="
                      account-page__login account-page__login--telegram
                    "
                    onClick={handleOpenModal}
                  >
                    <img src={telegramIcon} alt="Telegram" />

                    {telegramAccount?.telegramUsername
                      ? `Disconnect @${telegramAccount.telegramUsername}`
                      : 'Connect your Telegram'}
                  </DropDownButton>

                  {modal === 'formTelegram' && (
                    <CreateModal>
                      <LoginFormTelegram
                        title="Connect your Telegram"
                        type="modal"
                        setModal={setModal}
                        ref={modalRef}
                        onSubmit={handleConnectTelegram}
                        onClose={() => setModal('')}
                      />
                    </CreateModal>
                  )}

                  {modal === 'disconnectTelegram' && (
                    <CreateModal>
                      <ModalAlertMessage
                        title={`
                          Are you sure you want to disconnect
                          your @${telegramAccount?.telegramUsername} telegram account?
                        `}
                        description="
                          After disconnecting your current account,
                          you can connect another or the same account
                        "
                        ref={modalRef}
                        onClose={() => setModal('')}
                        dangerPlaceholder="Disconnect"
                        simplePlaceholder="Cancel"
                        onClickDanger={handleDisconnectTelegram}
                        onClickSimple={() => setModal('')}
                      />
                    </CreateModal>
                  )}
                </>
              )}
            </div>

            <Outlet />
          </div>
        )}
      </div>
    </main>
  );
};
