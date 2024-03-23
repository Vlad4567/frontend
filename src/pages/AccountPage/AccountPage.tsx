/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import { useIsomorphicLayoutEffect, useMediaQuery } from 'usehooks-ts';
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import * as appSlice from '../../features/appSlice';
import defaultAvatar from '../../img/default-avatar.svg';
import avatarEdit from '../../img/icons/icon-pen-edit.svg';
import { DropDownButton } from '../../components/DropDownButton/DropDownButton';
import styleVariables from '../../styles/variables.module.scss';
import { ArrowButton } from '../../components/ArrowButton/ArrowButton';
import { convertHyphenToSpace } from '../../helpers/functions';
import { UnderlinedSmall }
  from '../../components/UnderlinedSmall/UnderlinedSmall';
import {
  deleteRefreshToken,
  getUser,
  sendProfilePhoto,
} from '../../api/account';
import { showNotification } from '../../helpers/notifications';
import * as userSlice from '../../features/userSlice';
import './AccountPage.scss';

export const AccountPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.userSlice);
  const pathArray = useLocation().pathname.split('/');
  const currentPath = pathArray[pathArray.length - 1];
  const pathAfterAccount
    = pathArray[pathArray.findIndex(path => path === 'account') + 1] || '';
  const navigate = useNavigate();
  const isNotPhone = useMediaQuery(`(min-width: ${styleVariables['tablet-min-width']})`);
  const [isShownTabs, setIsShownTabs] = useState(false);

  useEffect(() => {
    if (currentPath === 'account' && isNotPhone) {
      navigate('personal-details', { replace: true });
    }
  }, [isNotPhone, currentPath, navigate]);

  useIsomorphicLayoutEffect(() => {
    dispatch(appSlice.setShownFooter(false));

    getUser()
      .then(res => {
        dispatch(userSlice.updateUser(res));
        setIsShownTabs(true);
      })
      .catch(() => showNotification('error'));

    return () => {
      dispatch(appSlice.setShownFooter(true));
    };
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const avatarFile = e.target.files?.item(0);

    if (avatarFile) {
      const formData = new FormData();

      formData.append('file', avatarFile);

      sendProfilePhoto(formData)
        .then(photo => {
          dispatch(userSlice.updateUser({
            profilePhoto: photo,
          }));
        })
        .catch(() => showNotification('error'));
    }
  };

  const handleTerminateSessions = () => {
    deleteRefreshToken()
      .then(() => {
        navigate('/login');
      })
      .catch(() => showNotification('error'));
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
        {((!isNotPhone && currentPath === 'account')
          || isNotPhone) && (
          <aside
            className="account-page__menu"
          >
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
              <p className="account-page__menu-username">
                {user.username}
              </p>
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
                {(user.master
                  || pathAfterAccount === 'edit-public-profile') && (
                  <li className="account-page__menu-nav-item">
                    <NavLink
                      to="./edit-public-profile"
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
              <NavLink
                to="/login"
                className="account-page__menu-log-out-link"
              >
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

        {isShownTabs && (
          <div className="account-page__main-content">
            <div className="account-page__main-title-wrapper">
              <h1 className="account-page__main-title">
                {convertHyphenToSpace(pathAfterAccount)}
              </h1>
            </div>

            <Outlet />
          </div>
        )}

      </div>
    </main>
  );
};
