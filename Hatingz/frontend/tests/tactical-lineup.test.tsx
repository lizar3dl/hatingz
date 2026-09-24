import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import LineupPage from "../src/pages/LineupPage";
import api from "../src/services/api";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe("tactical lineup", () => {
  it("lets the user remove and save a 4-3-3 lineup", async () => {
    localStorage.setItem("ratingz-token", "token");
    const postSpy = vi.spyOn(api, "post").mockResolvedValue({ data: { id: "lineup-1" } } as never);

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(<LineupPage />);
    });

    const removeButtons = Array.from(container.querySelectorAll("button")).filter((button) => button.textContent?.includes("Rafael Ratão"));
    expect(removeButtons.length).toBeGreaterThan(0);

    await act(async () => {
      removeButtons[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const saveButton = Array.from(container.querySelectorAll("button")).find((button) => button.textContent?.includes("Salvar escalação"));
    expect(saveButton).toBeTruthy();
    expect(saveButton?.disabled).toBe(true);

    const strikerButton = Array.from(container.querySelectorAll("button")).find((button) => button.textContent?.includes("Rafael Ratão (ATA)"));
    expect(strikerButton).toBeTruthy();
    await act(async () => {
      strikerButton!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const enabledSaveButton = Array.from(container.querySelectorAll("button")).find((button) => button.textContent?.includes("Salvar escalação"));
    expect(enabledSaveButton?.disabled).toBe(false);

    await act(async () => {
      enabledSaveButton!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(postSpy).toHaveBeenCalled();
    root.unmount();
    container.remove();
  });
});
