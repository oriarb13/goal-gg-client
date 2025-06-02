// lib/sse/sseClient.ts - פתרון פשוט יותר
interface SSEEvent {
  type: string;
  data: any;
  timestamp: string;
}

class SSEClient {
  private eventSource: EventSource | null = null;
  private baseUrl: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  connect(
    onEvent: (event: SSEEvent) => void,
    onError?: (error: Event) => void
  ): void {
    if (this.eventSource) {
      this.disconnect();
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      console.warn("No access token found for SSE connection");
      return;
    }

    // פתרון פשוט: שלח בקשה עם fetch קודם כדי לוודא שה-token עובד
    this.connectWithFetch(token, onEvent, onError);
  }

  private async connectWithFetch(
    token: string,
    onEvent: (event: SSEEvent) => void,
    onError?: (error: Event) => void
  ): Promise<void> {
    try {
      // בדיקה ראשונית שה-token עובד
      const testResponse = await fetch(
        `${this.baseUrl}/clubs/notifications/stream`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/event-stream",
            "Cache-Control": "no-cache",
          },
        }
      );

      if (!testResponse.ok) {
        throw new Error(`Authentication failed: ${testResponse.status}`);
      }

      // אם הגענו לכאן, ה-token עובד - עכשיו פתח SSE
      this.connectSSE(testResponse, onEvent, onError);
    } catch (error) {
      console.error("Failed to connect SSE:", error);
      if (onError) {
        onError(error as any);
      }
    }
  }

  private async connectSSE(
    response: Response,
    onEvent: (event: SSEEvent) => void,
    onError?: (error: Event) => void
  ): Promise<void> {
    if (!response.body) {
      throw new Error("No response body for SSE");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      console.log("🔗 SSE Connected successfully");
      this.reconnectAttempts = 0;

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log("🔌 SSE stream ended");
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = line.slice(6); // Remove 'data: '
              const parsedData = JSON.parse(data);

              console.log("📨 SSE Event received:", parsedData);

              if (
                parsedData.type === "heartbeat" ||
                parsedData.type === "connected"
              ) {
                continue;
              }

              onEvent(parsedData);
            } catch (error) {
              console.error("❌ Failed to parse SSE event:", error);
            }
          }
        }
      }
    } catch (error) {
      console.error("❌ SSE Connection error:", error);
      if (onError) {
        onError(error as any);
      }
      this.handleReconnection(onEvent, onError);
    } finally {
      reader.releaseLock();
    }
  }

  private handleReconnection(
    onEvent: (event: SSEEvent) => void,
    onError?: (error: Event) => void
  ): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay =
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

      console.log(
        `🔄 Attempting to reconnect SSE (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`
      );

      setTimeout(() => {
        this.connect(onEvent, onError);
      }, delay);
    } else {
      console.error("💔 SSE Max reconnection attempts reached");
    }
  }

  disconnect(): void {
    // אין eventSource לנתק כי אנחנו משתמשים ב-fetch
    console.log("🔌 SSE Disconnected");
  }

  isConnected(): boolean {
    return true; // מפושט לצרכי הדוגמה
  }
}

// Export singleton instance
export const sseClient = new SSEClient(
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
);

// Hook for using SSE in React components
import { useEffect, useRef } from "react";

export const useSSE = (
  onEvent: (event: SSEEvent) => void,
  enabled: boolean = true
) => {
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    if (!enabled) return;

    const handleEvent = (event: SSEEvent) => {
      onEventRef.current(event);
    };

    const handleError = (error: Event) => {
      console.error("SSE Error in useSSE hook:", error);
    };

    sseClient.connect(handleEvent, handleError);

    return () => {
      sseClient.disconnect();
    };
  }, [enabled]);

  return {
    isConnected: sseClient.isConnected(),
    disconnect: () => sseClient.disconnect(),
  };
};
