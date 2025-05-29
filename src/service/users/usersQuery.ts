import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { authUtils, usersApi } from "./usersApi";
import {
  loginSuccess,
  loginStart,
  loginFailure,
  updateUser,
  logout,
  clearError,
  selectCurrentUser,
  selectIsAuthenticated,
  selectUserLoading,
  selectUserError,
  initializeAuth,
} from "@/store/slices/userSlice";
import { type UserCreate, type UserLogin } from "@/types/userTypes";
import { type AppDispatch } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { showSnackBar } from "@/store/slices/snackBarSlice";

// =============================================
// Query Keys
// =============================================

export const USER_QUERY_KEYS = {
  all: ["users"] as const,
  lists: () => [...USER_QUERY_KEYS.all, "list"] as const,
  list: (filters: { skip?: number; limit?: number }) =>
    [...USER_QUERY_KEYS.lists(), filters] as const,
  details: () => [...USER_QUERY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...USER_QUERY_KEYS.details(), id] as const,
  current: () => [...USER_QUERY_KEYS.all, "current"] as const,
};

// =============================================
// Query Hooks
// =============================================
//get all users
export const useUsers = (skip: number = 0, limit: number = 100) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.list({ skip, limit }),
    queryFn: async () => {
      const response = await usersApi.getAllUsers(skip, limit);
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// get user by id
export const useUser = (userId: number) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(userId),
    queryFn: async () => {
      const response = await usersApi.getUserById(userId);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

// get current user
export const useCurrentUser = () => {
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const error = useSelector(selectUserError);
  const navigate = useNavigate();

  return useQuery({
    queryKey: USER_QUERY_KEYS.current(),
    queryFn: async () => {
      const response = await usersApi.auth();
      if (response.status === 200 && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to get current user");
    },
    initialData: currentUser,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        navigate("/");
        return false;
      }
      return failureCount < 3;
    },
    meta: {
      errorMessage: error,
    },
  });
};

// =============================================
// Mutation Hooks
// =============================================

// register user
export const useRegisterUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UserCreate) => usersApi.register(userData),
    onSuccess: (data) => {
      if (data.status === 201) {
        queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() }); //refetch the users list
      }
    },
    onError: (error: any) => {
      console.log("error", error);
    },
  });
};

// login user
export const useLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: UserLogin) => {
      dispatch(loginStart());
      const response = await usersApi.login(credentials);
      return response;
    },
    onSuccess: (data) => {
      if (data.status === 200 && data.data) {
        dispatch(
          loginSuccess({
            user: data.data.user,
            token: data.data.access_token,
          })
        );

        queryClient.setQueryData(USER_QUERY_KEYS.current(), data.data.user); //update the current user in the query cache

        queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all }); //refetch the users list
      }
    },
    onError: (error: any) => {
      dispatch(loginFailure(error.message || "Error logging in"));
    },
  });
};

// change user role
export const useChangeUserRole = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      newRoleId,
    }: {
      userId: number;
      newRoleId: number;
    }) => usersApi.changeRole(userId, newRoleId),
    onSuccess: (data, variables) => {
      if (data.status === 200) {
        console.log("data", data);

        if (data.data) {
          queryClient.setQueryData(
            USER_QUERY_KEYS.detail(variables.userId),
            data
          ); //update the user detail in the query cache

          const currentUser = authUtils.getCurrentUser();
          if (currentUser && currentUser.id === variables.userId) {
            dispatch(updateUser(data.data)); //update the current user in the redux store
          }
        }

        queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() }); //refetch the users list
        queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.current() }); //refetch the current user
      }
    },
    onError: (error: any) => {
      console.log("error", error);
    },
  });
};

// logout user
export const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      dispatch(logout()); //update the user state in the redux store
      return Promise.resolve();
    },
    onSuccess: () => {
      console.log("Logged out successfully");
      queryClient.clear();
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    },
  });
};

// initialize auth
export const useInitializeAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useMutation({
    mutationFn: () => dispatch(initializeAuth()), //initialize the auth state in the redux store
    onSuccess: () => {
      console.log("Auth initialized successfully");
    },
    onError: (error) => {
      console.log("Auth initialization failed:", error);
    },
  });
};

// =============================================
// Custom Auth Hook
// =============================================

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const login = async (credentials: UserLogin) => {
    try {
      const result = await loginMutation.mutateAsync(credentials);

      if (result.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logoutUser = () => {
    //show logout message
    dispatch(
      showSnackBar({
        message: "Logged out successfully",
        severity: "success",
        show: true,
      })
    );

    logoutMutation.mutate();
  };

  const clearUserError = () => {
    dispatch(clearError());
  };

  const initAuth = () => {
    dispatch(initializeAuth());
  };

  return {
    user: currentUser,
    loading: loading || loginMutation.isPending,
    error,
    login,
    logout: logoutUser,
    clearError: clearUserError,
    initializeAuth: initAuth,
    isAuthenticated,
    loginLoading: loginMutation.isPending,
    logoutLoading: logoutMutation.isPending,
  };
};
