import request from "supertest";
import app from "../../src/app";

function lineupPayload(teamSlug: string) {
  return {
    teamSlug,
    formation: "4-3-3",
    playerIds: [
      `${teamSlug}-1`,
      `${teamSlug}-2`,
      `${teamSlug}-3`,
      `${teamSlug}-4`,
      `${teamSlug}-5`,
      `${teamSlug}-6`,
      `${teamSlug}-7`,
      `${teamSlug}-8`,
      `${teamSlug}-9`,
      `${teamSlug}-10`,
      `${teamSlug}-11`,
    ],
    isPublished: true,
  };
}

describe("lineup integration", () => {
  it("rejects players that do not belong to the selected team", async () => {
    const registerResponse = await request(app).post("/api/auth/register").send({
      name: "Bahia Fan",
      email: "bahia.lineup.invalid@example.com",
      password: "password123",
      favoriteTeamSlug: "bahia",
    });

    const response = await request(app)
      .post("/api/lineups")
      .set("Authorization", `Bearer ${registerResponse.body.token}`)
      .send({
        ...lineupPayload("bahia"),
        playerIds: ["bahia-1", "bahia-2", "bahia-3", "bahia-4", "bahia-5", "bahia-6", "bahia-7", "bahia-8", "bahia-9", "bahia-10", "corinthians-1"],
      });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("INVALID_PLAYER");
  });

  it("prevents mutation of a published lineup", async () => {
    const registerResponse = await request(app).post("/api/auth/register").send({
      name: "Published Fan",
      email: "published.lineup@example.com",
      password: "password123",
      favoriteTeamSlug: "bahia",
    });

    const token = registerResponse.body.token;
    const initial = await request(app)
      .post("/api/lineups")
      .set("Authorization", `Bearer ${token}`)
      .send(lineupPayload("bahia"));

    expect(initial.status).toBe(201);

    const second = await request(app)
      .post("/api/lineups")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...lineupPayload("bahia"),
        isPublished: false,
      });

    expect(second.status).toBe(400);
    expect(second.body.code).toBe("LINEUP_IMMUTABLE");
  });

  it("enforces one vote per lineup for each user", async () => {
    const creator = await request(app).post("/api/auth/register").send({
      name: "Creator Fan",
      email: "creator.lineup.vote@example.com",
      password: "password123",
      favoriteTeamSlug: "bahia",
    });

    const voter = await request(app).post("/api/auth/register").send({
      name: "Voter Fan",
      email: "voter.lineup.vote@example.com",
      password: "password123",
      favoriteTeamSlug: "palmeiras",
    });

    const lineupResponse = await request(app)
      .post("/api/lineups")
      .set("Authorization", `Bearer ${creator.body.token}`)
      .send(lineupPayload("bahia"));

    const lineupId = lineupResponse.body.id;
    const firstVote = await request(app)
      .post(`/api/lineups/${lineupId}/votes`)
      .set("Authorization", `Bearer ${voter.body.token}`);

    expect(firstVote.status).toBe(201);

    const secondVote = await request(app)
      .post(`/api/lineups/${lineupId}/votes`)
      .set("Authorization", `Bearer ${voter.body.token}`);

    expect(secondVote.status).toBe(409);
    expect(secondVote.body.code).toBe("DUPLICATE_LINEUP_VOTE");
  });

  it("only returns published lineups for the authenticated user's favorite team", async () => {
    const bahiaUser = await request(app).post("/api/auth/register").send({
      name: "Bahia Feed Fan",
      email: "bahia.feed@example.com",
      password: "password123",
      favoriteTeamSlug: "bahia",
    });
    const palmeirasUser = await request(app).post("/api/auth/register").send({
      name: "Palmeiras Feed Fan",
      email: "palmeiras.feed@example.com",
      password: "password123",
      favoriteTeamSlug: "palmeiras",
    });

    const bahiaLineup = await request(app)
      .post("/api/lineups")
      .set("Authorization", `Bearer ${bahiaUser.body.token}`)
      .send(lineupPayload("bahia"));
    const palmeirasLineup = await request(app)
      .post("/api/lineups")
      .set("Authorization", `Bearer ${palmeirasUser.body.token}`)
      .send(lineupPayload("palmeiras"));

    expect(bahiaLineup.status).toBe(201);
    expect(palmeirasLineup.status).toBe(201);

    const feed = await request(app)
      .get("/api/lineups/community")
      .set("Authorization", `Bearer ${bahiaUser.body.token}`);

    expect(feed.status).toBe(200);
    expect(feed.body).toHaveLength(1);
    expect(feed.body[0].teamName).toBe("Bahia");
    expect(feed.body[0].id).toBe(bahiaLineup.body.id);
  });
});
