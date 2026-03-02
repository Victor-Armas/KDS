import { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

const initialState = {
  items: [],
  isOpen: false,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "add_item": {
      const existItem = state.items.some((i) => i.id === action.payload.id);

      if (existItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }

    case "remove_item": {
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      };
    }

    case "increment_item": {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      };
    }

    case "decrement_item": {
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0),
      };
    }

    case "clear_cart": {
      return {
        ...state,
        items: [],
      };
    }

    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item) => {
    dispatch({ type: "add_item", payload: item });
  };

  const removeItem = (itemId) => {
    dispatch({ type: "remove_item", payload: itemId });
  };

  const incrementItem = (itemId) => {
    dispatch({ type: "increment_item", payload: itemId });
  };

  const decrementItem = (itemId) => {
    dispatch({ type: "decrement_item", payload: itemId });
  };

  const clearCart = () => {
    dispatch({ type: "clear_cart" });
  };

  return (
    <CartContext.Provider
      value={{
        addItem,
        removeItem,
        incrementItem,
        decrementItem,
        clearCart,
        items: state.items,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};
