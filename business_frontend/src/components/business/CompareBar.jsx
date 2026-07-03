import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, ArrowRight, BarChart3 } from "lucide-react";

const COMPARE_KEY = "vyora_compare_items";

export const getCompareItems = () => {
  try {
    return JSON.parse(localStorage.getItem(COMPARE_KEY) || "[]");
  } catch {
    return [];
  }
};

export const addCompareItem = (item) => {
  const items = getCompareItems();
  if (items.find(i => i.id === item.id)) return items;
  if (items.length >= 3) {
    alert("You can compare maximum 3 items at a time.");
    return items;
  }
  const newItems = [...items, { id: item.id, title: item.title, price: item.price, image: item.image }];
  localStorage.setItem(COMPARE_KEY, JSON.stringify(newItems));
  window.dispatchEvent(new Event("compareUpdate"));
  return newItems;
};

export const removeCompareItem = (id) => {
  const items = getCompareItems().filter(i => i.id !== id);
  localStorage.setItem(COMPARE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("compareUpdate"));
  return items;
};

export const clearCompareItems = () => {
  localStorage.removeItem(COMPARE_KEY);
  window.dispatchEvent(new Event("compareUpdate"));
};

const CompareBar = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getCompareItems());
    const handler = () => setItems(getCompareItems());
    window.addEventListener("compareUpdate", handler);
    return () => window.removeEventListener("compareUpdate", handler);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="text-green-600" size={20} />
          <span className="text-sm font-semibold text-gray-700">
            Compare ({items.length}/3)
          </span>
          <div className="flex gap-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
                <span className="text-xs font-medium text-gray-600 truncate max-w-[100px]">{item.title}</span>
                <button onClick={() => removeCompareItem(item.id)} className="text-gray-400 hover:text-red-500 transition">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={clearCompareItems} className="text-xs text-gray-500 hover:text-gray-700 transition">
            Clear All
          </button>
          <Link
            to="/compare-businesses"
            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            Compare Now
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;