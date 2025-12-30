import React, { useEffect, useState, useContext } from 'react';
import { Pagination } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Contexts & Services (Assuming these paths exist in your project)
import productService from "../services/ProductService";
import { useCart } from "../context/CartContext";
import AuthContext from "../context/AuthContext";
import favoriteService from '../services/favoriteService';
import {Heart } from "lucide-react"
/* --- 1. SVG ICONS --- */
const IconEye = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
const IconBag = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>;
const IconHeart = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;
const StarIcon = ({ filled }) => (
  <svg className={`w-4 h-4 ${filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={filled ? "0" : "2"} fill="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

/* --- 2. SINGLE PRODUCT CARD COMPONENT WITH VECTOR ANIMATION --- */

const SingleProductCard = ({ product, onAdd, onGoToCart, qty, isFavorite, onToggleFavorite }) => {
  const rating = product.rating || 5;

  return (
    <div className="group w-full max-w-sm bg-white border border-gray-100 rounded-md p-5 relative transition-all duration-300 hover:shadow-xl cursor-pointer font-sans flex flex-col justify-between h-full overflow-hidden">

      {/* VECTOR BORDER ANIMATION SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="0.375rem" fill="none" stroke="#672674" strokeWidth="2" className="vector-border-path" />
      </svg>

      <div className="relative z-10 flex flex-col h-full">
        <div className="relative w-full h-56 flex items-center justify-center mb-5 overflow-hidden">
          <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105" />

          {/* Hover Action Buttons */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 opacity-0 flex flex-col gap-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 z-20">
            <button onClick={onAdd} title="Quick Add" className="bg-[#672674] text-white w-10 h-10 flex items-center justify-center hover:bg-[#672674] transition-colors shadow-sm rounded-sm">
              <IconBag />
            </button>

            {/* --- FAVORITE BUTTON --- */}
            <button
              onClick={() => onToggleFavorite(product._id)}
              className="bg-[#672674] text-white w-10 h-10 flex items-center justify-center hover:bg-[#672674] transition-colors shadow-sm rounded-sm"
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              {/* Logic: If favorite, fill white. If not, transparent fill */}
              <Heart
                size={18}
                className={`transition-all duration-300 ${isFavorite ? "fill-white" : "fill-none"}`}
              />
            </button>

            <button className="bg-[#672674] text-white w-10 h-10 flex items-center justify-center hover:bg-[#672674] transition-colors shadow-sm rounded-sm">
              <IconEye />
            </button>
          </div>
        </div>

        {/* Product Details (Unchanged) */}
        <div className="text-center flex flex-col flex-grow">
          {/* <div className="flex justify-center items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (<StarIcon key={i} filled={i < rating} />))}
            <span className="text-gray-400 text-xs ml-2">(1 review)</span>
          </div> */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{product.name}</h3>
          <div className="relative h-px bg-gray-200 w-4/5 mx-auto my-3 transition-colors duration-300 group-hover:bg-[#672674]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#672674] rotate-45 z-10"></div>
          </div>
          <div className="text-xl font-bold text-gray-700 mb-4">₹{product.price}</div>
          <div className="mt-auto flex flex-col gap-2">
            <button onClick={onAdd} className="w-full py-2 bg-[#672674] text-white font-semibold rounded hover:bg-[#672674] transition-colors text-sm">
              {qty > 0 ? `Add More (${qty})` : "Add to Cart"}
            </button>
            <button onClick={onGoToCart} className="w-full py-2 border border-[#672674] text-[#672674] font-semibold rounded hover:bg-red-50 transition-colors text-sm">
              Go to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- 3. MAIN APP COMPONENT ---------------- */

/* ---------------- 3. MAIN APP COMPONENT ---------------- */

const ProductCardApp = () => {
  const vectorStyles = `
    .vector-border-path { stroke-dasharray: 1500; stroke-dashoffset: 1500; transition: stroke-dashoffset 0.8s ease-in-out; opacity: 0; }
    .group:hover .vector-border-path { stroke-dashoffset: 0; opacity: 1; }
  `;

  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]); // Store array of Favorite Product IDs
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const { addToCart, cart } = useCart();
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  /* 1. FETCH PRODUCTS & FAVORITES */
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch Products
        const prodRes = await productService.getProducts();
        setProducts(prodRes.data || []);

        // Fetch Favorites (Only if logged in)
        if (isAuthenticated) {
          const favRes = await favoriteService.getMyFavorites();
          // Assuming API returns array of objects with product_id, we map to just IDs
          // Adjust based on your actual API response structure
          const favIds = favRes.data.map(item => item.product_id._id || item.product_id);
          setFavorites(favIds);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      }
    };

    loadData();
    AOS.init({ duration: 1000, once: true });
  }, [isAuthenticated]);

  /* 2. HANDLE FAVORITE TOGGLE */
  const handleToggleFavorite = async (productId) => {
    if (!isAuthenticated) {
      toast.warning("Please login to manage favorites");
      return;
    }

    // Optimistic Update: Update UI immediately before API finishes
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(productId)) {
        return prevFavorites.filter(id => id !== productId); // Remove
      } else {
        return [...prevFavorites, productId]; // Add
      }
    });

    try {
      await favoriteService.toggleFavorite(productId);
      toast.success("Favorites updated");
    } catch (err) {
      toast.error("Failed to update favorite");
      // Revert state if API fails (Optional, but recommended)
    }
  };

  /* HANDLERS */
  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.warning("Please login to add items");
      navigate("/login");
      return;
    }
    addToCart(product._id);
  };

  const getQty = (id) => cart.find((item) => item.product._id === id)?.quantity || 0;

  // Pagination Logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const displayedProducts = products.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="bg-[#191716] min-h-screen p-8 flex flex-col items-center" id="services">
      <style>{vectorStyles}</style>
      <h2 className="text-4xl font-bold text-white mb-10 tracking-wide">Best Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-7xl">
        {displayedProducts.map((product) => (
          <div key={product._id} className="flex justify-center" data-aos="fade-up">
            <SingleProductCard
              product={product}
              qty={getQty(product._id)}

              // Pass the boolean state and handler
              isFavorite={favorites.includes(product._id)}
              onToggleFavorite={handleToggleFavorite}

              onAdd={() => handleAddToCart(product)}
              onGoToCart={() => navigate("/cart")}
            />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 bg-white p-2 rounded-lg shadow-lg">
          <Pagination count={totalPages} page={page} onChange={(e, val) => setPage(val)} color="secondary" />
        </div>
      )}
    </div>
  );
};

export default ProductCardApp;
