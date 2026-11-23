export type TProtectedRouteProps = {
  /** `true` — маршрут только для неавторизованных (вход, регистрация, сброс пароля). */
  onlyUnAuth?: boolean;
  children: React.JSX.Element;
};
