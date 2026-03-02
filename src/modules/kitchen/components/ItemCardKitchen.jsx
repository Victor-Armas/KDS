import React from "react";

export default function ItemCardKitchen({ item }) {
  return (
    <li className="flex items-start gap-3 text-slate-800 text-base sm:text-lg">
      <span className="font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
        {item.quantity}X
      </span>
      <span className="font-medium leading-tight break-words">
        {item.product_name}
      </span>
    </li>
  );
}
