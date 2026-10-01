import { Submission, SubmissionStatus } from "./types";

/**
 * SubmissionStore arayüzü.
 * Mock/development için in-memory implementasyonu.
 * Production'da gerçek DB/CMS ile değiştirilmeli.
 */
export interface SubmissionStore {
  create(submission: Submission): Promise<void>;
  getAll(): Promise<readonly Submission[]>;
  getById(id: string): Promise<Submission | undefined>;
  getFirstApprovedAtForShop(shopUrl: string): Promise<string | undefined>;
  updateStatus(id: string, status: SubmissionStatus): Promise<void>;
}

/**
 * İn-memory store. Server restart sonrası kaybolur.
 * Production için uygun değil.
 */
class InMemorySubmissionStore implements SubmissionStore {
  private submissions: Submission[] = [];

  create(submission: Submission): Promise<void> {
    this.submissions.push(submission);
    return Promise.resolve();
  }

  getAll(): Promise<readonly Submission[]> {
    return Promise.resolve(this.submissions);
  }

  getById(id: string): Promise<Submission | undefined> {
    const found = this.submissions.find((s) => s.id === id);
    return Promise.resolve(found);
  }

  getFirstApprovedAtForShop(shopUrl: string): Promise<string | undefined> {
    const first = this.submissions
      .filter((submission) => submission.sellerShopUrl === shopUrl && submission.status === "approved" && submission.approvedAt)
      .sort((a, b) => a.approvedAt!.localeCompare(b.approvedAt!))[0];
    return Promise.resolve(first?.approvedAt);
  }

  updateStatus(id: string, status: SubmissionStatus): Promise<void> {
    const idx = this.submissions.findIndex((s) => s.id === id);
    if (idx < 0 || this.submissions[idx].status !== "pending") {
      return Promise.reject(new Error("Submission not found or no longer pending."));
    }
    this.submissions[idx] = {
      ...this.submissions[idx],
      status,
      ...(status === "approved" ? { approvedAt: new Date().toISOString() } : {}),
    };
    return Promise.resolve();
  }
}

export const devSubmissionStore = new InMemorySubmissionStore();
