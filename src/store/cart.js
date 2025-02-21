import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,

  addToCart: (deal) =>
    set((state) => {
      const index = state.items.findIndex(
        (item) => item.cartItemId && item.cartItemId === deal.cartItemId
      );
      
      if (index === -1) {
        return {
          items: [...state.items, { ...deal, quantity: 1 }],
          total: state.total + Number(deal.price),
          itemCount: state.itemCount + 1,
        };
      }
      
      const newItems = [...state.items];
      newItems[index] = {
        ...newItems[index],
        quantity: newItems[index].quantity + 1,
      };
      
      return {
        items: newItems,
        total: state.total + Number(deal.price),
        itemCount: state.itemCount + 1,
      };
    }),

  updateItemQuantity: (index, newQuantity) =>
    set((state) => {
      if (newQuantity < 1) {
        return get().removeFromCart(index);
      }
      
      const newItems = [...state.items];
      const oldQuantity = newItems[index].quantity;
      const priceDifference = (newQuantity - oldQuantity) * Number(newItems[index].price);
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
        total: state.total - Number(removedItem.price) * removedItem.quantity,
        itemCount: state.itemCount - removedItem.quantity,
      };
    }),

  clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
}));