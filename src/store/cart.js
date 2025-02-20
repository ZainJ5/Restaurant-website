import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,

  addToCart: (deal) =>
    set((state) => {
      const index = state.items.findIndex(
        (item) =>
          item.id === deal.id &&
          JSON.stringify(item.options) === JSON.stringify(deal.options)
      );
      const newItems = [...state.items];
      if (index > -1) {
        newItems[index] = {
          ...newItems[index],
          quantity: newItems[index].quantity + 1,
        };
      } else {
        newItems.push({ ...deal, quantity: 1 });
      }
      return {
        items: newItems,
        total: state.total + deal.price,
        itemCount: state.itemCount + 1,
      };
    }),

  updateItemQuantity: (index, newQuantity) =>
    set((state) => {
      if (newQuantity < 1) return {};
      const newItems = [...state.items];
      const oldQuantity = newItems[index].quantity;
      const priceDifference = (newQuantity - oldQuantity) * newItems[index].price;
      newItems[index] = {
        ...newItems[index],
        quantity: newQuantity,
      };
      return {
        items: newItems,
        total: state.total + priceDifference,
        itemCount: state.itemCount + (newQuantity - oldQuantity),
      };
    }),

  removeFromCart: (index) =>
    set((state) => {
      const newItems = [...state.items];
      const removedItem = newItems.splice(index, 1)[0];
      return {
        items: newItems,
        total: state.total - removedItem.price * removedItem.quantity,
        itemCount: state.itemCount - removedItem.quantity,
      };
    }),

  clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
}));
