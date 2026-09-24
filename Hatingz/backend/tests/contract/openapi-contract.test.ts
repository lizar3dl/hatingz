import fs from "fs";
import path from "path";

describe("openapi contract coverage", () => {
  it("covers the public API contract surface", () => {
    const spec = fs.readFileSync(path.resolve(__dirname, "../../../specs/001-ratingz-platform/contracts/openapi.yaml"), "utf8");

    expect(spec).toContain("/api/auth/register");
    expect(spec).toContain("/api/auth/login");
    expect(spec).toContain("/api/matches");
    expect(spec).toContain("/api/lineups");
    expect(spec).toContain("/api/lineups/community");
    expect(spec).toContain("/api/lineups/{lineupId}/votes");
    expect(spec).toContain("/api/matches/{matchId}/expulsion-votes");
    expect(spec).toContain("ValidationError");
    expect(spec).toContain("ConflictError");
    expect(spec).toContain("UnauthorizedError");
  });
});
