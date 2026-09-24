import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import ExpulsionVotingPage from "../src/pages/ExpulsionVotingPage";
import api from "../src/services/api";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe("expulsion voting page", () => {
  it("loads eligible players and registers a vote", async () => {
    localStorage.setItem("ratingz-token", "token");
    vi.spyOn(api, "get").mockResolvedValue({
      data: [{ id: "corinthians-1", name: "Cássio", position: "GOL", teamId: "team-corinthians", teamName: "Corinthians", voteCount: 3, hasVoted: false, state: "open" }],
    } as never);
    vi.spyOn(api, "post").mockResolvedValue({ data: { voteCount: 4 } } as never);

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(<ExpulsionVotingPage />);
    });

    await act(async () => {
      await Promise.resolve();
    });

    const candidate = Array.from(container.querySelectorAll("article")).find((card) => card.textContent?.includes("Cássio"));
    expect(candidate).toBeTruthy();
    expect(candidate?.textContent).toContain("3");
    const voteButton = Array.from(candidate!.querySelectorAll("button")).find((button) => button.textContent?.includes("Votar"));
    expect(voteButton).toBeTruthy();

    await act(async () => {
      voteButton!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(container.textContent).toContain("Voto registrado com sucesso.");
    expect(candidate?.textContent).toContain("4");
    expect(voteButton?.textContent).toContain("Votado");
    root.unmount();
    container.remove();
  });
});
