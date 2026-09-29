import { ClickEvent } from "./types";

/**
 * Storage interface for outbound click events.
 * In production this should persist to a database or external analytics.
 * The default implementation is in-memory only and resets on server restart —
 * suitable for local development / smoke testing only.
 */
export interface ClickStore {
  record(event: ClickEvent): void;
  /** Return all recorded events (for inspection / future export). */
  getAll(): readonly ClickEvent[];
}

/**
 * In-memory store for local development.
 * NOT persisted — events are lost on server restart.
 * Do not use in production.
 */
class InMemoryClickStore implements ClickStore {
  private events: ClickEvent[] = [];
  record(event: ClickEvent) {
    this.events.push(event);
  }
  getAll() {
    return this.events;
  }
}

export const devClickStore = new InMemoryClickStore();
