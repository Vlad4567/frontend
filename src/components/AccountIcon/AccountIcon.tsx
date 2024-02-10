import lightAccountIcon from '../../img/icons/account-icon-light.svg';
import darkAccountIcon from '../../img/icons/account-icon-dark.svg';

interface Props {
  type: 'light' | 'dark'
}

export const AccountIcon: React.FC<Props> = ({ type }) => {
  const pathToIcon = type === 'light' ? lightAccountIcon : darkAccountIcon;

  return (
    <img src={pathToIcon} alt="Account icon" />
  );
};
