import type { RootState } from '@services/store';
import type { TFeedState, TOrder, TProfileOrdersState } from '@utils-types';

export const selectOrderRequest = (state: RootState): boolean =>
  state.order.orderRequest;

export const selectOrderModalData = (state: RootState): TOrder | null =>
  state.order.orderModalData;

export const selectFeed = (state: RootState): TFeedState => state.feed;

export const selectProfileOrders = (state: RootState): TProfileOrdersState =>
  state.profileOrders;

/* Ищем заказ там, где он уже мог загрузиться: в ленте, в истории или среди
   заказов, запрошенных по номеру. */
export const selectOrderByNumber = (
  state: RootState,
  number: number
): TOrder | undefined => {
  const { currentOrder } = state.order;

  return (
    state.feed.orders.find((order) => order.number === number) ??
    state.profileOrders.orders.find((order) => order.number === number) ??
    (currentOrder?.number === number ? currentOrder : undefined)
  );
};
