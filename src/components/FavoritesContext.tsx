import React, { createContext, FunctionComponent, useContext, useEffect, useState } from "react";
import { FavoritesStorage } from "../storage/Storage";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (imageUrl: string) => void;
  isFavorite: (imageUrl: string) => boolean;
  removeFavorite: (item: string) => void;
  clearAllFavorites: () => void;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await FavoritesStorage.getFavorites();
        setFavorites(stored);
      } catch (error) {
        console.error("Failed to load favorites:", error);
        setFavorites([]);
      }
    };
    loadFavorites();
  }, []);

  // Save helper function
  const saveAndUpdate = async (updated: string[]) => {
    setFavorites(updated);
    try {
      await FavoritesStorage.saveFavorites(updated);
    } catch (error) {
      console.error("Failed to save favorites:", error);
    }
  };

  const toggleFavorite = (imageUrl: string) => {
    if (favorites.includes(imageUrl)) {
      saveAndUpdate(favorites.filter((item) => item !== imageUrl));
    } else {
      saveAndUpdate([...favorites, imageUrl]);
    }
  };

  const removeFavorite = (item: string) => {
    saveAndUpdate(favorites.filter((fav) => fav !== item));
  };

  const clearAllFavorites = () => {
    saveAndUpdate([]);
  };

  const isFavorite = (imageUrl: string) => favorites.includes(imageUrl);

  const favoritesCount = favorites.length;

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        removeFavorite,
        clearAllFavorites,
        favoritesCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }
  return ctx;
};
