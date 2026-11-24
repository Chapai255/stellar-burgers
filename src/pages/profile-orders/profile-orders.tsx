import { selectProfileOrders } from '@selectors';
import { fetchProfileOrders } from '@slices';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector(selectProfileOrders);

  useEffect(() => {
    void dispatch(fetchProfileOrders());
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error && !orders.length) {
    return (
      <p className="text text_type_main-default">Не удалось загрузить историю заказов</p>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
