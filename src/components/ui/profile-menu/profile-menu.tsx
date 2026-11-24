import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

import type { ProfileMenuUIProps } from './type';

import styles from './profile-menu.module.css';

const getLinkClassName = ({ isActive }: { isActive: boolean }): string =>
  clsx(
    'text text_type_main-medium text_color_inactive pt-4 pb-4',
    styles.link,
    isActive && styles.link_active
  );

export const ProfileMenuUI = ({
  pathname,
  handleLogout,
}: ProfileMenuUIProps): React.JSX.Element => (
  <>
    <NavLink to={'/profile'} className={getLinkClassName} end>
      Профиль
    </NavLink>
    <NavLink to={'/profile/orders'} className={getLinkClassName}>
      История заказов
    </NavLink>
    <button
      className={clsx(
        'text text_type_main-medium text_color_inactive pt-4 pb-4',
        styles.button
      )}
      onClick={handleLogout}
    >
      Выход
    </button>
    <p className="pt-20 text text_type_main-default text_color_inactive">
      {pathname === '/profile'
        ? 'В этом разделе вы можете изменить свои персональные данные'
        : 'В этом разделе вы можете просмотреть свою историю заказов'}
    </p>
  </>
);
