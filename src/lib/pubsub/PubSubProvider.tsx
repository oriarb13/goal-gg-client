// components/PubSubProvider.tsx - עדכון הקובץ שלך
import React from "react";
import { useClubJoinListener } from "@/hooks/pubsub/useClubJoinListener";
import { useSSE } from "@/lib/sse/sseClient"; // 🆕 הוסף את זה
import { toast } from "sonner";
import { useSelector } from "react-redux"; // 🆕 הוסף את זה
import { selectCurrentUser } from "@/store/slices/userSlice"; // 🆕 הוסף את זה

interface PubSubProviderProps {
  children: React.ReactNode;
}

const PubSubProvider: React.FC<PubSubProviderProps> = ({ children }) => {
  const currentUser = useSelector(selectCurrentUser); // 🆕 הוסף את זה

  // listener to club join events (הקוד הקיים שלך)
  useClubJoinListener((data) => {
    toast.success(`🎉 ${data.userName} joined the club!`, {
      description: `Club ${data.clubId}`,
      duration: 3000,
    });

    console.log("🎯 Local PubSub Event - User Joined Club:", {
      clubId: data.clubId,
      userId: data.userId,
      userName: data.userName,
      timestamp: new Date(data.timestamp).toLocaleString("he-IL"),
    });
  });

  // 🆕 הוסף את זה - מאזין לSSE מהשרת
  useSSE((event) => {
    console.log("📡 SSE Event received:", event);

    switch (event.type) {
      case "club:join-request":
        // בקשה חדשה למועדון (רק לאדמין של המועדון הזה)
        if (event.data.admin_id === currentUser?.id) {
          toast.info(`📩 בקשה חדשה למועדון`, {
            description: `${event.data.user_name} רוצה להצטרף`,
            duration: 5000,
            action: {
              label: "צפה",
              onClick: () => {
                console.log("Navigate to club:", event.data.club_id);
                // כאן תוכל להוסיף ניווט למועדון
              },
            },
          });
        }
        break;

      case "club:user-joined":
        // משתמש הצטרף למועדון (רק לאדמין)
        toast.success(`✅ ${event.data.user_name} הצטרף למועדון!`, {
          description: `מועדון מספר ${event.data.club_id}`,
          duration: 4000,
        });
        break;

      case "club:request-approved":
        // הבקשה שלי אושרה (רק למשתמש שהבקשה שלו אושרה)
        if (event.data.user_id === currentUser?.id) {
          toast.success(`🎉 הבקשה שלך אושרה!`, {
            description: "אתה יכול כעת להיכנס למועדון",
            duration: 5000,
            action: {
              label: "צפה במועדון",
              onClick: () => {
                window.location.href = `/clubs/${event.data.club_id}`;
              },
            },
          });
        }
        break;

      default:
        console.log("Unknown SSE event type:", event.type);
    }
  }, !!currentUser); // רק אם יש משתמש מחובר

  return <>{children}</>;
};

export default PubSubProvider;
