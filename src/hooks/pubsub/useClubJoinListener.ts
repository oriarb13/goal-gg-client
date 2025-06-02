import { useEffect } from "react";
import { pubSub } from "@/lib/pubsub/pubSub";

export const useClubJoinListener = (
  onUserJoined: (data: {
    clubId: number;
    userId: number;
    userName: string;
    timestamp: number;
  }) => void
) => {
  useEffect(() => {
    const unsubscribe = pubSub.onClubJoin((data) => {
      onUserJoined(data);
    });

    return unsubscribe; //clear when component unmounts
  }, [onUserJoined]);
};
