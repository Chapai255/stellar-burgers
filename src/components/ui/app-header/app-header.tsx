import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

const INGREDIENTS_ROUTE_PREFIX = '/ingredients/';

const getLinkClassName = (isActive: boolean): string =>
  clsx(styles.link, isActive && styles.link_active);

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => {
  const { pathname } = useLocation();

  /* Страница ингредиента относится к конструктору, поэтому его ссылка остаётся
     активной и на /ingredients/:id, и когда ингредиент открыт в модальном окне. */
  const isIngredientRoute = pathname.startsWith(INGREDIENTS_ROUTE_PREFIX);

  return (
    <header className={styles.header}>
      <nav className={clsx(styles.menu, 'p-4')}>
        <div className={styles.menu_part_left}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => getLinkClassName(isActive || isIngredientRoute)}
          >
            {({ isActive }) => (
              <>
                <BurgerIcon
                  type={isActive || isIngredientRoute ? 'primary' : 'secondary'}
                />
                <p className="text text_type_main-default ml-2 mr-10">Конструктор</p>
              </>
            )}
          </NavLink>
          <NavLink to="/feed" className={({ isActive }) => getLinkClassName(isActive)}>
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Лента заказов</p>
              </>
            )}
          </NavLink>
        </div>
        <div className={styles.logo}>
          <Logo className="" />
        </div>
        <div className={styles.link_position_last}>
          <NavLink
            to="/profile"
            className={({ isActive }) => getLinkClassName(isActive)}
          >
            {({ isActive }) => (
              <>
                <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">
                  {userName ?? 'Личный кабинет'}
                </p>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
