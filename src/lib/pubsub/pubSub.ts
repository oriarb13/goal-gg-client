interface ClubJoinEvent {
  clubId: number;
  userId: number;
  userName: string;
  timestamp: number;
}

class SimplePubSub {
  private events = new EventTarget();

  publishClubJoin(data: ClubJoinEvent): void {
    this.events.dispatchEvent(
      new CustomEvent("club:user-joined", {
        detail: { ...data, timestamp: Date.now() },
      })
    );
  }

  onClubJoin(callback: (data: ClubJoinEvent) => void): () => void {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<ClubJoinEvent>;
      callback(customEvent.detail);
    };

    this.events.addEventListener("club:user-joined", handler);

    // Return unsubscribe function
    return () => this.events.removeEventListener("club:user-joined", handler);
  }
}

export const pubSub = new SimplePubSub();
