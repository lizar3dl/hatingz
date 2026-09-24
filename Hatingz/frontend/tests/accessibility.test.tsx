import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import DashboardPage from "../src/pages/DashboardPage";
import LoginPage from "../src/pages/LoginPage";
import RegisterPage from "../src/pages/RegisterPage";
import LineupPage from "../src/pages/LineupPage";
import CommunityLineupsPage from "../src/pages/CommunityLineupsPage";
import ExpulsionVotingPage from "../src/pages/ExpulsionVotingPage";
import api from "../src/services/api";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

async function renderPage(page: JSX.Element) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(<MemoryRouter>{page}</MemoryRouter>);
  });
  return { container, root };
}

describe("accessibility and page smoke checks", () => {
  it("renders the main login and register screens", async () => {
    vi.spyOn(api, "get").mockResolvedValue({ data: [] } as never);
    const login = await renderPage(<LoginPage />);
    expect(login.container.querySelector("h1")?.textContent).toContain("Bem-vindo de volta");

    const register = await renderPage(<RegisterPage />);
    expect(register.container.querySelector("h1")?.textContent).toContain("Crie sua conta");

    login.root.unmount();
    login.container.remove();
    register.root.unmount();
    register.container.remove();
  });

  it("renders dashboard, lineup, community feed and voting screens", async () => {
    localStorage.setItem("ratingz-token", "token");
    vi.spyOn(api, "get").mockResolvedValue({ data: [] } as never);

    const dashboard = await renderPage(<DashboardPage />);
    expect(dashboard.container.querySelector("h1")?.textContent).toContain("Jogos em destaque");

    const lineup = await renderPage(<LineupPage />);
    expect(lineup.container.querySelector("h1")?.textContent).toContain("Prancheta");

    const community = await renderPage(<CommunityLineupsPage />);
    expect(community.container.querySelector("h1")?.textContent).toContain("Feed");

    const vote = await renderPage(<ExpulsionVotingPage />);
    expect(vote.container.querySelector("h1")?.textContent).toContain("Votação");

    dashboard.root.unmount();
    dashboard.container.remove();
    lineup.root.unmount();
    lineup.container.remove();
    community.root.unmount();
    community.container.remove();
    vote.root.unmount();
    vote.container.remove();
  });
});
