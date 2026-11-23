import type { TProtectedRouteProps } from './type';

/**
 * Каркас защищённого маршрута. Пока проверки авторизации нет, он просто
 * отдаёт вложенный компонент, чтобы все страницы были доступны по URL.
 *
 * TODO (шаг 2): взять из стора пользователя и признак «проверка авторизации
 * завершена», затем добавить:
 *  - пока проверка не завершена — показывать <Preloader />;
 *  - `onlyUnAuth` и пользователь авторизован — <Navigate> на `state.from` или `/`;
 *  - нет `onlyUnAuth` и пользователь не авторизован — <Navigate> на `/login`
 *    с `state={{ from: location }}`.
 */
export const ProtectedRoute = ({ children }: TProtectedRouteProps): React.JSX.Element =>
  children;
