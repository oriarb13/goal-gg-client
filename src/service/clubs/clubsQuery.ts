import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { clubsApi } from "./clubsApi";
import { type ClubCreate, type ClubSearchFilters } from "@/types/clubTypes";
import { type AppDispatch } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { showSnackBar } from "@/store/slices/snackBarSlice";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { pubSub } from "@/lib/pubsub/pubSub";

// =============================================
// Query Keys
// =============================================

export const CLUB_QUERY_KEYS = {
  all: ["clubs"] as const,
  lists: () => [...CLUB_QUERY_KEYS.all, "list"] as const,
  search: (filters: ClubSearchFilters) =>
    [...CLUB_QUERY_KEYS.lists(), "search", filters] as const,
  myClubs: () => [...CLUB_QUERY_KEYS.lists(), "my-clubs"] as const,
  details: () => [...CLUB_QUERY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...CLUB_QUERY_KEYS.details(), id] as const,
};

// =============================================
// Query Hooks
// =============================================

// search clubs
export const useSearchClubs = (filters: ClubSearchFilters) => {
  return useQuery({
    queryKey: CLUB_QUERY_KEYS.search(filters),
    queryFn: async () => {
      const response = await clubsApi.searchClubs(filters);
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// get my clubs
export const useMyClubs = () => {
  return useQuery({
    queryKey: CLUB_QUERY_KEYS.myClubs(),
    queryFn: async () => {
      const response = await clubsApi.getMyClubs();
      return response.data || [];
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// get club by id
export const useClub = (clubId: number) => {
  return useQuery({
    queryKey: CLUB_QUERY_KEYS.detail(clubId),
    queryFn: async () => {
      const response = await clubsApi.getClubById(clubId);
      return response.data;
    },
    enabled: !!clubId,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// =============================================
// Mutation Hooks
// =============================================

// create club
export const useCreateClub = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (clubData: ClubCreate) => clubsApi.createClub(clubData),
    onSuccess: (data) => {
      if (data.status === 201) {
        dispatch(
          showSnackBar({
            message: "Club created successfully!",
            severity: "success",
            show: true,
          })
        );

        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.lists() });
        queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.myClubs() });

        // Navigate to the new club
        if (data.data?.id) {
          navigate(`/clubs/${data.data.id}`);
        }
      }
    },
    onError: (error: any) => {
      dispatch(
        showSnackBar({
          message: error.message || "Failed to create club",
          severity: "error",
          show: true,
        })
      );
    },
  });
};

// join club
export const useJoinClub = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const currentUser = useSelector(selectCurrentUser);

  return useMutation({
    mutationFn: (clubId: number) => clubsApi.joinClub(clubId),
    onSuccess: (data, clubId) => {
      if (data.status === 200 || data.status === 201) {
        const message = data.message || "Successfully joined the club";

        dispatch(
          showSnackBar({
            message,
            severity: "success",
            show: true,
          })
        );

        // Invalidate relevant queries
        queryClient.invalidateQueries({
          queryKey: CLUB_QUERY_KEYS.detail(clubId),
        });
        queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.myClubs() });
        queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.lists() });

        // pubsub-------------------------------------------------------------------------------------------
        if (data.status === 200 && currentUser) {
          pubSub.publishClubJoin({
            clubId,
            userId: currentUser.id,
            userName: currentUser.first_name + " " + currentUser.last_name,
            timestamp: Date.now(),
          });
        }
      }
    },
    onError: (error: any) => {
      dispatch(
        showSnackBar({
          message: error.message || "Failed to join club",
          severity: "error",
          show: true,
        })
      );
    },
  });
};

// accept join request
export const useAcceptRequest = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clubId,
      requestId,
    }: {
      clubId: number;
      requestId: number;
    }) => clubsApi.acceptRequest(clubId, requestId),
    onSuccess: (data, { clubId }) => {
      if (data.status === 200) {
        dispatch(
          showSnackBar({
            message: "Request accepted successfully!",
            severity: "success",
            show: true,
          })
        );

        // Invalidate relevant queries
        queryClient.invalidateQueries({
          queryKey: CLUB_QUERY_KEYS.detail(clubId),
        });
        queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.myClubs() });
      }
    },
    onError: (error: any) => {
      dispatch(
        showSnackBar({
          message: error.message || "Failed to accept request",
          severity: "error",
          show: true,
        })
      );
    },
  });
};

// leave club
export const useLeaveClub = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clubId, userId }: { clubId: number; userId?: number }) =>
      clubsApi.leaveClub(clubId, userId),
    onSuccess: (data, { clubId, userId }) => {
      if (data.status === 200) {
        const message = userId
          ? "User removed from club successfully"
          : "Successfully left the club";

        dispatch(
          showSnackBar({
            message,
            severity: "success",
            show: true,
          })
        );

        // Invalidate relevant queries
        queryClient.invalidateQueries({
          queryKey: CLUB_QUERY_KEYS.detail(clubId),
        });
        queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.myClubs() });
        queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.lists() });
      }
    },
    onError: (error: any) => {
      dispatch(
        showSnackBar({
          message: error.message || "Failed to leave club",
          severity: "error",
          show: true,
        })
      );
    },
  });
};

// =============================================
// Custom Club Hook
// =============================================

export const useClubActions = (clubId?: number) => {
  const currentUser = useSelector(selectCurrentUser);
  const createClubMutation = useCreateClub();
  const joinClubMutation = useJoinClub();
  const acceptRequestMutation = useAcceptRequest();
  const leaveClubMutation = useLeaveClub();

  // Get club data if clubId is provided
  const {
    data: club,
    isLoading: clubLoading,
    error: clubError,
  } = useClub(clubId || 0);

  const createClub = async (clubData: ClubCreate) => {
    try {
      const result = await createClubMutation.mutateAsync(clubData);
      return result.status === 201;
    } catch (error) {
      return false;
    }
  };

  const joinClub = async (targetClubId: number) => {
    try {
      const result = await joinClubMutation.mutateAsync(targetClubId);
      return result.status === 200 || result.status === 201;
    } catch (error) {
      return false;
    }
  };

  const acceptRequest = async (targetClubId: number, requestId: number) => {
    try {
      const result = await acceptRequestMutation.mutateAsync({
        clubId: targetClubId,
        requestId,
      });
      return result.status === 200;
    } catch (error) {
      return false;
    }
  };

  const leaveClub = async (targetClubId: number, userId?: number) => {
    try {
      const result = await leaveClubMutation.mutateAsync({
        clubId: targetClubId,
        userId,
      });
      return result.status === 200;
    } catch (error) {
      return false;
    }
  };

  return {
    // Data
    club,
    clubLoading,
    clubError,

    // Actions
    createClub,
    joinClub,
    acceptRequest,
    leaveClub,

    // Loading states
    createLoading: createClubMutation.isPending,
    joinLoading: joinClubMutation.isPending,
    acceptLoading: acceptRequestMutation.isPending,
    leaveLoading: leaveClubMutation.isPending,
  };
};
