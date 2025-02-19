'use client'
import { createContext, useContext, useState } from 'react'
import { toast } from 'react-toastify'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ 
    items: [], 
    total: 0,
    itemCount: 0 
  })

  const findItemIndex = (deal) => {
    return cart.items.findIndex(item => 
      item.id === deal.id && 
      JSON.stringify(item.options) === JSON.stringify(deal.options)
    )
  }

  const addToCart = (deal) => {
    setCart((prev) => {
      const existingIndex = findItemIndex(deal)
      let newItems = [...prev.items]
      
      if (existingIndex > -1) {
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1
        }
      } else {
        newItems.push({ ...deal, quantity: 1 })
      }
      
      return {
        items: newItems,
        total: prev.total + deal.price,
        itemCount: prev.itemCount + 1
      }
    })
    
    toast.success(`${deal.title} added to cart!`, {
      icon: '🍗',
      style: { background: '#dc2626', color: '#ffffff' }
    })
  }

  const updateItemQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return
    
    setCart((prev) => {
      const newItems = [...prev.items]
      const oldQuantity = newItems[index].quantity
      const priceDifference = (newQuantity - oldQuantity) * newItems[index].price
      
      newItems[index] = {
        ...newItems[index],
        quantity: newQuantity
      }
      
      return {
        items: newItems,
        total: prev.total + priceDifference,
        itemCount: prev.itemCount + (newQuantity - oldQuantity)
      }
    })
  }

  const removeFromCart = (index) => {
    setCart((prev) => {
      const newItems = [...prev.items]
      const removedItem = newItems.splice(index, 1)[0]
      return {
        items: newItems,
        total: prev.total - (removedItem.price * removedItem.quantity),
        itemCount: prev.itemCount - removedItem.quantity
      }
    })
    
    toast.info(`Item removed from cart`, {
      style: { background: '#dc2626', color: '#ffffff' }
    })
  }

  const clearCart = () => {
    setCart({ items: [], total: 0, itemCount: 0 })
    toast.error('Cart cleared', {
      style: { background: '#dc2626', color: '#ffffff' }
    })
  }

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        clearCart,
        updateItemQuantity 
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}