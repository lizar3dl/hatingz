import request from "supertest";
import app from "../../src/app";

describe("expulsion vote contract", () => {
  it("lists eligible players and records a vote once per match/player", async () => {
    const registerResponse = await request(app).post("/api/auth/register").send({
      name: "Expulsion Fan",
      email: "expulsion.contract@example.com",
      password: "password123",
      favoriteTeamSlug: "corinthians",
    });

    const token = registerResponse.body.token;
    const listResponse = await request(app).get("/api/matches/match-corinthians-bahia/expulsion-votes").set("Authorization", `Bearer ${token}`);
    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body)).toBe(true);

    const firstPlayer = listResponse.body[0];
    const voteResponse = await request(app)
      .post("/api/matches/match-corinthians-bahia/expulsion-votes")
      .set("Authorization", `Bearer ${token}`)
      .send({ playerId: firstPlayer.id });

    expect(voteResponse.status).toBe(201);
    expect(voteResponse.body.voteCount).toBeGreaterThanOrEqual(1);

    const duplicateResponse = await request(app)
      .post("/api/matches/match-corinthians-bahia/expulsion-votes")
      .set("Authorization", `Bearer ${token}`)
      .send({ playerId: firstPlayer.id });

    expect(duplicateResponse.status).toBe(409);
  });
});
