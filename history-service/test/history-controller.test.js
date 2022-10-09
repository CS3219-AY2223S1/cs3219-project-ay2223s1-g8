require("dotenv/config");
const request = require("supertest");
const History = require("../model/history-model");
const app = require("../app");
const { connectDatabase, closeDatabase, clearDatabase } = require("./db-handler");
const {
  validUserHistory1,
  validUserHistory2,
  validUserHistory3_emptyAttemptsArray,
  validAddAttemptRequest,
  validDeleteUserHistoryRequest,
  invalidUserAttempts_missingQid,
  invalidUserAttempts_missingContent,
  invalidAddAttemptRequest_missingQid,
  invalidAddAttemptRequest_missingContext,
} = require("./test-fixure");

/* Connecting to the database before all tests. */
beforeAll(async () => connectDatabase());

/* Clearing data from the database before each test. */
beforeEach(async () => clearDatabase());

/* Dropping the database and closing connection after all test. */
afterAll(async () => closeDatabase());

// --------------------------------------------
//                 GET REQUESTS
// --------------------------------------------

describe("GET /api/history/all", () => {
  it("should return 200 with all user histories", async () => {
    const res = await request(app).get("/api/history/all");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("All history retrieved successfully!");
    expect(res.body.data).toStrictEqual([]);
  });
});

describe("GET /api/history", () => {
  it("should return 200 with the user history", async () => {
    const newHistory = new History(validUserHistory1);
    await newHistory.save();

    const res = await request(app).get("/api/history").send({ uid: validUserHistory1.uid });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User history retrieved successfully!");
    expect(res.body.data.uid).toBe(validUserHistory1.uid);
    expect(res.body.data.attempts).toEqual(
      expect.arrayContaining([
        expect.objectContaining(validUserHistory1.attempts[0]),
        expect.objectContaining(validUserHistory1.attempts[1])
      ])
    );
  });

  it("should return 400 with no uid", async () => {
    const newHistory = new History(validUserHistory1);
    await newHistory.save();

    const res = await request(app).get("/api/history").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Uid is missing from request body!");
  });

  it("should return 404 when uid is not found", async () => {
  const res = await request(app).get("/api/history").send({ uid: validUserHistory1.uid });
    expect(res.statusCode).toBe(404);
    // expect(res.body.message).toBe(`Unable to find user history with uid ${validUserHistory1.uid}.`);
  });
});

describe("GET /api/history/attempt", () => {
  it("should return 200 with the user's attempt to the qid", async () => {
    const newHistory = new History(validUserHistory1);
    await newHistory.save();

    const res = await request(app).get("/api/history/attempt")
      .send({
        uid: validUserHistory1.uid,
        qid: validUserHistory1.attempts[0].qid,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User attempt retrieved successfully!");
    expect(res.body.data.qid).toBe(validUserHistory1.attempts[0].qid);
    expect(res.body.data.content).toBe(validUserHistory1.attempts[0].content);
  });

  it("should return 400 with no uid", async () => {
    const newHistory = new History(validUserHistory1);
    await newHistory.save();

    const res = await request(app).get("/api/history/attempt")
      .send({
        qid: validUserHistory1.attempts[0].qid,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Uid or qid missing from request body!");
  });

  it("should return 400 with no qid", async () => {
    const newHistory = new History(validUserHistory1);
    await newHistory.save();

    const res = await request(app).get("/api/history/attempt")
      .send({
        uid: validUserHistory1.uid,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Uid or qid missing from request body!");
  });

  it("should return 400 with no uid and qid", async () => {
    const newHistory = new History(validUserHistory1);
    await newHistory.save();

    const res = await request(app).get("/api/history/attempt").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Uid or qid missing from request body!");
  });

  it("should return 404 when uid is not found", async () => {
    const res = await request(app).get("/api/history/attempt")
      .send({
        uid: validUserHistory1.uid,
        qid: validUserHistory1.attempts[0].qid,
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe(`Unable to find user history with uid ${validUserHistory1.uid}.`);
  });

  it("should return 404 when qid is not found", async () => {
    const newHistory = new History(validUserHistory1);
    await newHistory.save();

    const res = await request(app).get("/api/history/attempt")
      .send({
        uid: validUserHistory1.uid,
        qid: "question-3",
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.message)
      .toBe(`Unable to find user history ${validUserHistory1.uid}'s attempt with qid question-3.`);
  });
});

// --------------------------------------------
//                 POST REQUESTS
// --------------------------------------------

describe("POST /api/history", () => {
  it("should return 200 and create a new user history", async () => {
    const res = await request(app).post("/api/history").send(validUserHistory1);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User history created successfully!");
    expect(res.body.data.uid).toBe(validUserHistory1.uid);
    expect(res.body.data.attempts).toHaveLength(2);
    expect(res.body.data.attempts).toEqual(
      expect.arrayContaining([
        expect.objectContaining(validUserHistory1.attempts[0]),
        expect.objectContaining(validUserHistory1.attempts[1])
      ])
    );
  });

  it("should return 200 with empty array for attempts", async () => {
    const res = await request(app).post("/api/history").send(validUserHistory3_emptyAttemptsArray);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User history created successfully!");
    expect(res.body.data.uid).toBe(validUserHistory3_emptyAttemptsArray.uid);
    expect(res.body.data.attempts).toHaveLength(0);
  });

  it("should return 400 with no uid", async () => {
    const res = await request(app).post("/api/history")
      .send({
        attempts: validUserHistory1.attempts,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Uid or attempts missing from request body!");
  });

  it("should return 400 with no attempts", async () => {
    const res = await request(app).post("/api/history")
      .send({
        uid: validUserHistory1.uid,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Uid or attempts missing from request body!");
  });

  it("should return 409 when there is a duplicate uid", async () => {
    const newHistory = new History(validUserHistory1);
    await newHistory.save();

    const res = await request(app).post("/api/history").send(validUserHistory1);
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("Duplicate user history detected!");
  });

  it("should return 400 when attempts has missing qid", async () => {
    const res = await request(app).post("/api/history").send(invalidUserAttempts_missingQid);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Attempts has the wrong format!");
  });

  it("should return 400 when attempts has missing content", async () => {
    const res = await request(app).post("/api/history").send(invalidUserAttempts_missingContent);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Attempts has the wrong format!");
  });
});

describe("POST /api/history/attempt", () => {
  it("should return 200 and create a new user history with the attempt added to the history", async () => {
    const res = await request(app).post("/api/history/attempt").send(validAddAttemptRequest);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User attempt added successfully!");
    expect(res.body.data.uid).toBe(validAddAttemptRequest.uid);
    expect(res.body.data.attempts).toEqual(
      expect.arrayContaining([
        expect.objectContaining(validAddAttemptRequest.attempt)
      ])
    );
  });
  
  it("should return 200 and update user history with the new attempt", async () => {
    const newHistory = new History(validUserHistory1);
    await newHistory.save();

    const res = await request(app).post("/api/history/attempt").send(validAddAttemptRequest);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User attempt added successfully!");
    expect(res.body.data.uid).toBe(validAddAttemptRequest.uid);
    expect(res.body.data.attempts).toHaveLength(2);
    expect(res.body.data.attempts).toEqual(
      expect.arrayContaining([
        expect.objectContaining(validAddAttemptRequest.attempt),
        expect.objectContaining(validUserHistory1.attempts[1])
      ])
    );
  });

  it("should return 400 when attempt has missing qid", async () => {
    const res = await request(app).post("/api/history/attempt").send(invalidAddAttemptRequest_missingQid);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Attempt has the wrong format!");
  });

  it("should return 400 when attempts ha missing content", async () => {
    const res = await request(app).post("/api/history/attempt").send(invalidAddAttemptRequest_missingContext);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Attempt has the wrong format!");
  });
});

// --------------------------------------------
//                DELETE REQUESTS
// --------------------------------------------

describe("DELETE /api/history/all", () => {
  it("should return 200 and delete all histories in the database", async () => {
    const newHistory1 = new History(validUserHistory1);
    await newHistory1.save();
    const newHistory2 = new History(validUserHistory2);
    await newHistory2.save();

    const res = await request(app).delete("/api/history/all");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("All user history deleted successfully!");
  });
});

describe("DELETE /api/history", () => {
  it("should return 200 and delete the history in the database", async () => {
    const newHistory = new History(validUserHistory1);
    await newHistory.save();

    const res = await request(app).delete("/api/history").send(validDeleteUserHistoryRequest);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User history deleted successfully!");
    expect(res.body.data.uid).toBe(validUserHistory1.uid);
    expect(res.body.data.attempts).toEqual(
      expect.arrayContaining([
        expect.objectContaining(validUserHistory1.attempts[0]),
        expect.objectContaining(validUserHistory1.attempts[1])
      ])
    );
  });

  it("should return 400 with no uid", async () => {
    const newHistory = new History(validUserHistory1);
    await newHistory.save();

    const res = await request(app).delete("/api/history").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Uid missing from request body!");
  });

  it("should return 404 when uid is not found", async () => {
    const res = await request(app).delete("/api/history").send(validDeleteUserHistoryRequest);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe(`Unable to find user history with uid ${validDeleteUserHistoryRequest.uid}.`);
  });
});