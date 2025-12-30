import React, { useEffect, useState } from "react";
import favoriteService from "../services/favoriteService";
import { HeartOff } from "lucide-react";
import { toast } from "react-toastify";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      const res = await favoriteService.getMyFavorites();
      setFavorites(res.data);
    } catch (err) {
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const removeFavorite = async (productId) => {
    try {
      await favoriteService.removeFavorite(productId);
      toast.success("Removed from favorites");
      loadFavorites();
    } catch {
      toast.error("Failed to remove");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#672674]">My Favorites ❤️</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">No favorite items yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div
              key={fav._id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <img
                src={fav.product_id.image}
                alt={fav.product_id.name}
                className="w-full h-40 object-cover rounded"
              />

              <h3 className="mt-3 font-semibold">
                {fav.product_id.name}
              </h3>

              <p className="text-gray-600">
                ₹{fav.product_id.price}
              </p>

              <button
                onClick={() => removeFavorite(fav.product_id._id)}
                className="mt-3 flex items-center gap-2 text-red-600 hover:text-red-800"
              >
                <HeartOff size={16} />
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
