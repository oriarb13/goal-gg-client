import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import snackBarReducer from "./snackBarSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    snackBar: snackBarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "auth/fetchCurrentUser/fulfilled",
          "snackBar/showSnackBar",
          "snackBar/hideSnackBar",
        ],
        // Ignore these field paths in all actions
        ignoredPaths: ["auth.user.createdAt", "auth.user.updatedAt"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks for easier use of dispatch and selector
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
