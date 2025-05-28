import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import userService from "@/api/services/userService";
import { User } from "@/types/types";
import { showSnackBar } from "@/store/snackBarSlice";
import { AppDispatch } from "./store";
import { NextRouter } from "next/router";

// Define error structure for API responses
interface APIError {
  success: boolean;
  status: string;
  message: string;
  stack?: string;
}

// Define the shape of the user state in the Redux store
interface UserState {
  user: User | null;
  loading: boolean;
  error: APIError | null;
  isAuthenticating: boolean;
}

// Initial state for the user slice
const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticating: true,
};

// Helper function to standardize error handling
const handleApiError = (error: any) => {
  if (error?.response?.data && !error.response.data.success) {
    return {
      success: false,
      status: error.response.data.status || "fail",
      message: error.response.data.message || "Server error",
      stack: error.response.data.stack,
    };
  }

  if (typeof error === "string") {
    return {
      success: false,
      status: "fail",
      message: error,
    };
  }

  return {
    success: false,
    status: "error",
    message: error?.message || "An unknown error occurred",
  };
};

// Async thunk to check user authentication
export const checkAuthentication = createAsyncThunk<
  boolean,
  { showAuthError?: boolean; router?: NextRouter } | undefined,
  { state: { user: UserState }; dispatch: AppDispatch }
>("user/checkAuthentication", async (params, { dispatch, getState }) => {
  const token = localStorage.getItem("token");
  const currentUser = getState().user.user;

  // If no token but user exists in state, log out
  if (!token && currentUser) {
    // Logout user from Redux
    dispatch(logout());

    // Show authentication error if requested
    if (params?.showAuthError !== false) {
      dispatch(
        showSnackBar({
          message: "Session expired, please log in again",
          severity: "error",
          show: true,
        })
      );
    }

    // Handle redirection if router is provided
    if (params?.router) {
      const publicRoutes = ["/", "/about"];
      if (!publicRoutes.includes(params.router.pathname)) {
        params.router.push("/");
      }
    }

    return false;
  }

  return !!token && !!currentUser;
});

// Async thunk to fetch current user details
export const fetchCurrentUser = createAsyncThunk<
  User,
  { router?: NextRouter; showAuthError?: boolean } | undefined,
  { rejectValue: APIError; dispatch: AppDispatch }
>("user/fetchCurrentUser", async (params, { rejectWithValue, dispatch }) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      if (
        params?.router &&
        params.router.pathname !== "/" &&
        params.router.pathname !== "/about"
      ) {
        params.router.push("/");
      }
      localStorage.removeItem("token");

      if (params?.showAuthError !== false) {
        dispatch(
          showSnackBar({
            message: "You need to log in to access this page",
            severity: "error",
            show: true,
          })
        );
      }

      return rejectWithValue({
        success: false,
        status: "fail",
        message: "No authentication token",
      });
    }

    const response = await userService.getConnectedUser();

    if (response.success) {
      return response.data;
    }

    localStorage.removeItem("token");
    if (
      params?.router &&
      params.router.pathname !== "/" &&
      params.router.pathname !== "/about"
    ) {
      params.router.push("/");
    }

    if (params?.showAuthError !== false) {
      dispatch(
        showSnackBar({
          message: "Authentication failed, please log in again",
          severity: "error",
          show: true,
        })
      );
    }

    return rejectWithValue({
      success: false,
      status: "fail",
      message: "Failed to fetch user data",
    });
  } catch (error: any) {
    localStorage.removeItem("token");
    if (
      params?.router &&
      params.router.pathname !== "/" &&
      params.router.pathname !== "/about"
    ) {
      params.router.push("/");
    }

    if (params?.showAuthError !== false) {
      dispatch(
        showSnackBar({
          message: "Authentication failed, please log in again",
          severity: "error",
          show: true,
        })
      );
    }

    return rejectWithValue(handleApiError(error));
  }
});

// Async thunk to log out user
export const logoutUser = createAsyncThunk<
  void,
  { router?: NextRouter; showMessage?: boolean } | undefined,
  { dispatch: AppDispatch }
>("user/logoutUser", async (params, { dispatch }) => {
  localStorage.removeItem("token");

  if (params?.showMessage !== false) {
    dispatch(
      showSnackBar({
        message: "You have been logged out successfully",
        severity: "success",
        show: true,
      })
    );
  }

  if (
    params?.router &&
    params.router.pathname !== "/" &&
    params.router.pathname !== "/about"
  ) {
    params.router.push("/");
  }
});

// Create the user slice with reducers and extra reducers
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Set user in state
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
      state.isAuthenticating = false;
    },

    // Logout action for the reducer
    logout: (state) => {
      state.user = null;
      state.isAuthenticating = false;
    },

    // Clear any existing errors
    clearError: (state) => {
      state.error = null;
    },

    // Manually set an error in state
    setError: (state, action: PayloadAction<APIError>) => {
      state.error = action.payload;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set authenticating state
    setAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticating = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthenticating = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.isAuthenticating = false;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload || {
          success: false,
          status: "error",
          message: "Authentication failed",
        };
        state.isAuthenticating = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.isAuthenticating = false;
      })
      .addCase(checkAuthentication.fulfilled, () => {});
  },
});

export const {
  setUser,
  logout,
  clearError,
  setError,
  setLoading,
  setAuthenticating,
} = userSlice.actions;

export default userSlice.reducer;
