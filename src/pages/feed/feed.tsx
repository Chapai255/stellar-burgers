import { selectFeed } from '@selectors';
import { fetchFeed } from '@slices';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector(selectFeed);

  const handleGetFeeds = (): void => {
    void dispatch(fetchFeed());
  };

  useEffect(() => {
    void dispatch(fetchFeed());
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error && !orders.length) {
    return (
      <p className="text text_type_main-default">Не удалось загрузить ленту заказов</p>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
