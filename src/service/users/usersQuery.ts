import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authUtils, usersApi } from "./usersApi";
import {
  type UserCreate,
  type UserLogin,
  //   type UserFull,
} from "@/types/userTypes";

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
// Query Hooks (לקריאת נתונים)
// =============================================

/**
 * Hook לקבלת כל המשתמשים עם pagination
 */
export const useUsers = (skip: number = 0, limit: number = 100) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.list({ skip, limit }),
    queryFn: async () => {
      const response = await usersApi.getAllUsers(skip, limit);
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 דקות
    gcTime: 10 * 60 * 1000, // 10 דקות
  });
};

/**
 * Hook לקבלת משתמש ספציפי לפי ID
 */
export const useUser = (userId: number) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(userId),
    queryFn: async () => {
      const response = await usersApi.getUserById(userId);
      return response.data;
    },
    enabled: !!userId, // רק אם יש userId
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook לקבלת המשתמש הנוכחי (מתעדכן מהשרת)
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.current(),
    queryFn: async () => {
      const currentUser = authUtils.getCurrentUser();
      if (!currentUser) return null;

      // מעדכן מהשרת
      const response = await usersApi.getUserById(currentUser.id);
      return response.data;
    },
    enabled: authUtils.isAuthenticated(),
    staleTime: 2 * 60 * 1000, // 2 דקות
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });
};

// =============================================
// Mutation Hooks (לעדכון נתונים)
// =============================================

/**
 * Hook להרשמת משתמש חדש
 */
export const useRegisterUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UserCreate) => usersApi.register(userData),
    onSuccess: (data) => {
      console.log(data);
      //   toast.success("נרשמת בהצלחה!");
      // מעדכן רשימת משתמשים
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
    },
    onError: (error: any) => {
      console.log(error);
      //   toast.error(error.message || "שגיאה בהרשמה");
    },
  });
};

/**
 * Hook להתחברות
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: UserLogin) => usersApi.login(credentials),
    onSuccess: (data) => {
      if (data.data) {
        // שמירת נתוני התחברות
        authUtils.saveAuth(data.data);

        // toast.success("התחברת בהצלחה!");
        console.log(data);

        // שומר המשתמש הנוכחי ב-cache
        queryClient.setQueryData(USER_QUERY_KEYS.current(), data.data.user);

        // מעדכן כל queries של משתמשים
        queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
      }
    },
    onError: (error: any) => {
      //   toast.error(error.message || "שגיאה בהתחברות");
      console.log(error);
    },
  });
};

/**
 * Hook לשינוי תפקיד משתמש
 */
export const useChangeUserRole = () => {
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
      //   toast.success("תפקיד המשתמש עודכן בהצלחה!");
      console.log(data);

      // מעדכן המשתמש הספציפי ב-cache
      if (data.data) {
        queryClient.setQueryData(
          USER_QUERY_KEYS.detail(variables.userId),
          data
        );
      }

      // מעדכן רשימות ומשתמש נוכחי
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.current() });
    },
    onError: (error: any) => {
      console.log(error);
      //   toast.error(error.message || "שגיאה בעדכון תפקיד המשתמש");
    },
  });
};

/**
 * Hook להתנתקות
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      authUtils.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      //   toast.success("התנתקת בהצלחה!");
      console.log("התנתקת בהצלחה!");
      // מנקה את כל ה-cache
      queryClient.clear();
      // מפנה לדף התחברות
      window.location.href = "/login";
    },
  });
};

// =============================================
// Composed Auth Hook (משלב הכל)
// =============================================

export const useAuth = () => {
  const { data: user, isLoading, error } = useCurrentUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const login = async (credentials: UserLogin) => {
    try {
      const result = await loginMutation.mutateAsync(credentials);
      return result.data;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user: user || null,
    loading: isLoading,
    error,
    login,
    logout,
    isAuthenticated: authUtils.isAuthenticated() && !!user,
    loginLoading: loginMutation.isPending,
    logoutLoading: logoutMutation.isPending,
  };
};

// =============================================
// Helper Functions
// =============================================

/**
 * פונקציה לטעינה מוקדמת של משתמש
 */
export const prefetchUser = async (queryClient: any, userId: number) => {
  await queryClient.prefetchQuery({
    queryKey: USER_QUERY_KEYS.detail(userId),
    queryFn: () => usersApi.getUserById(userId),
    staleTime: 5 * 60 * 1000,
  });
};
