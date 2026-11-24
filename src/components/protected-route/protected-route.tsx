import { selectIsAuthChecked, selectUser } from '@selectors';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

import { useSelector } from '@services/store';

import type { TProtectedRouteProps } from './type';
import type { TLocationState } from '@utils-types';

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
}: TProtectedRouteProps): React.JSX.Element => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  /* Вход, регистрация и сброс пароля не нужны уже залогиненному пользователю:
     возвращаем его туда, откуда его отправили на /login, или на главную. */
  if (onlyUnAuth && user) {
    const from = (location.state as TLocationState)?.from ?? { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};
