import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute,
} from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import { fetchIngredients } from '@slices';
import { useCallback, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';

import { useDispatch } from '@services/store';

import type { TDetailPageProps } from './type';
import type { Location } from 'react-router-dom';

import '../../index.css';

import styles from './app.module.css';

/* Если пользователь пришёл на маршрут кликом по ингредиенту или заказу, ссылка
   кладёт в state страницу, поверх которой нужно показать модальное окно. */
type TLocationState = { background?: Location } | null;

const useCloseModal = (): (() => void) => {
  const navigate = useNavigate();

  return useCallback((): void => {
    void navigate(-1);
  }, [navigate]);
};

const useOrderTitle = (): string => {
  const { number } = useParams<{ number: string }>();

  return number ? `#${number.padStart(6, '0')}` : '';
};

/* Страница с подробностями при прямом заходе по адресу (без модального окна). */
const DetailPage = ({ title, children }: TDetailPageProps): React.JSX.Element => (
  <div className={styles.detailPageWrap}>
    <h1 className={`${styles.detailHeader} text text_type_main-large`}>{title}</h1>
    {children}
  </div>
);

const IngredientPage = (): React.JSX.Element => (
  <DetailPage title="Детали ингредиента">
    <IngredientDetails />
  </DetailPage>
);

const OrderPage = (): React.JSX.Element => {
  const title = useOrderTitle();

  return (
    <DetailPage title={title}>
      <OrderInfo />
    </DetailPage>
  );
};

const IngredientModal = (): React.JSX.Element => {
  const onClose = useCloseModal();

  return (
    <Modal title="Детали ингредиента" onClose={onClose}>
      <IngredientDetails />
    </Modal>
  );
};

const OrderModal = (): React.JSX.Element => {
  const title = useOrderTitle();
  const onClose = useCloseModal();

  return (
    <Modal title={title} onClose={onClose}>
      <OrderInfo />
    </Modal>
  );
};

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const background = (location.state as TLocationState)?.background;

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/:number" element={<OrderPage />} />
        <Route path="/ingredients/:id" element={<IngredientPage />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route path="/feed/:number" element={<OrderModal />} />
          <Route path="/ingredients/:id" element={<IngredientModal />} />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <OrderModal />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
