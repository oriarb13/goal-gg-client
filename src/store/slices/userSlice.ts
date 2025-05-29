import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { UserFull } from "@/types/userTypes";
import { usersApi } from "@/service/users/usersApi";

interface UserState {
  currentUser: UserFull | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};
//initialize auth
export const initializeAuth = createAsyncThunk(
  "user/initializeAuth",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      try {
        const response = await usersApi.auth();
        if (response.status === 200 && response.data) {
          return response.data;
        } else {
          localStorage.removeItem("access_token");
          throw new Error("Auth failed");
        }
      } catch (error: any) {
        localStorage.removeItem("access_token");
        return rejectWithValue(error.message || "Auth failed");
      }
    }

    return rejectWithValue("No token found");
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  //for login
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: UserFull; token: string }>
    ) => {
      state.currentUser = action.payload.user;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      localStorage.setItem("access_token", action.payload.token);
    },

    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.currentUser = null;
      localStorage.removeItem("access_token");
    },

    updateUser: (state, action: PayloadAction<UserFull>) => {
      state.currentUser = action.payload;
    },

    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("access_token");
    },

    clearError: (state) => {
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },

  //for initialize auth
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.loading = false;
        state.currentUser = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  loginSuccess,
  loginStart,
  loginFailure,
  updateUser,
  logout,
  clearError,
  setLoading,
} = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { user: UserState }) =>
  state.user.currentUser;
export const selectIsAuthenticated = (state: { user: UserState }) =>
  state.user.isAuthenticated;
export const selectUserLoading = (state: { user: UserState }) =>
  state.user.loading;
export const selectUserError = (state: { user: UserState }) => state.user.error;
