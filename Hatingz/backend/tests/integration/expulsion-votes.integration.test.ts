import request from "supertest";
import app from "../../src/app";

describe("expulsion vote integration", () => {
  it("enforces unique user-match-player votes", async () => {
    const registerResponse = await request(app).post("/api/auth/register").send({
      name: "Expulsion Integrator",
      email: "expulsion.integration@example.com",
      password: "password123",
      favoriteTeamSlug: "corinthians",
    });

    const token = registerResponse.body.token;
    const eligiblePlayers = await request(app)
      .get("/api/matches/match-corinthians-bahia/expulsion-votes")
      .set("Authorization", `Bearer ${token}`);

    const playerId = eligiblePlayers.body[0].id;

    const firstVote = await request(app)
      .post("/api/matches/match-corinthians-bahia/expulsion-votes")
      .set("Authorization", `Bearer ${token}`)
      .send({ playerId });

    expect(firstVote.status).toBe(201);

    const secondVote = await request(app)
      .post("/api/matches/match-corinthians-bahia/expulsion-votes")
      .set("Authorization", `Bearer ${token}`)
      .send({ playerId });

    expect(secondVote.status).toBe(409);
    expect(secondVote.body.code).toBe("DUPLICATE_VOTE");
  });
});
