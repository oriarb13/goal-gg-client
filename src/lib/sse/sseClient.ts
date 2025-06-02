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

    // צריך לעשות request עם headers כי EventSource לא תומך בheaders ישירות
    const url = `${this.baseUrl}/clubs/notifications/stream`;

    this.eventSource = new EventSource(url);

    this.eventSource.onopen = (event) => {
      console.log("🔗 SSE Connected successfully");
      this.reconnectAttempts = 0;
    };

    this.eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        console.log("📨 SSE Event received:", parsedData);

        if (
          parsedData.type === "heartbeat" ||
          parsedData.type === "connected"
        ) {
          return;
        }

        onEvent(parsedData);
      } catch (error) {
        console.error("❌ Failed to parse SSE event:", error);
      }
    };

    this.eventSource.onerror = (event) => {
      console.error("❌ SSE Connection error:", event);

      if (onError) {
        onError(event);
      }

      this.handleReconnection(onEvent, onError);
    };
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
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log("🔌 SSE Disconnected");
    }
  }

  isConnected(): boolean {
    return (
      this.eventSource !== null &&
      this.eventSource.readyState === EventSource.OPEN
    );
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
