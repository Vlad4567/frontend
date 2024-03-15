import { NavLink, Outlet } from 'react-router-dom';
import classNames from 'classnames';
import { useMediaQuery } from 'usehooks-ts';
import { convertSpaceToHyphen }
  from '../../helpers/functions';
import { DropDownButton } from '../../components/DropDownButton/DropDownButton';
import styleVariables from '../../styles/variables.module.scss';
import { useAppSelector } from '../../app/hooks';
import './EditPublicProfilePage.scss';

const navButtons
  = ['Area of work', 'Contacts', 'Adress', 'Gallery', 'Services'];

export const EditPublicProfilePage: React.FC = () => {
  const { user } = useAppSelector(state => state.userSlice);
  const isDesktop = useMediaQuery(`(min-width: ${styleVariables['desktop-min-width']})`);

  return (
    <div className="edit-public-profile-page">
      <nav className="edit-public-profile-page__nav">
        {navButtons.map((button, index) => (
          <>
            <NavLink
              className={({ isActive }) => classNames(
                'edit-public-profile-page__nav-link',
                {
                  'edit-public-profile-page__nav-link--active': isActive,
                },
              )}
              to={`./${convertSpaceToHyphen(button)}`}
              key={button}
              style={user.master || index > 2
                ? { pointerEvents: 'none' }
                : {}}
            >
              <DropDownButton
                placeholder={`${index + 1}${isDesktop ? ` ${button}` : ''}`}
                size="small"
                className="edit-public-profile-page__nav-link-btn"
              />
            </NavLink>

            {navButtons.length - 2 >= index && (
              <hr className="edit-public-profile-page__nav-hr" />
            )}
          </>
        ))}
      </nav>

      <Outlet />
    </div>
  );
};