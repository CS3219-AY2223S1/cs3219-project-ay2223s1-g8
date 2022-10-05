require("dotenv/config");
const server = require("./index.js");
const supertest = require("supertest");
const requestWithSupertest = supertest(server.app);
const { Sequelize } = require("sequelize");
const {
  createQuestionModel,
  createAssignedQuestionsModel,
} = require("./model/question-model");
const config = require("./config/config")[process.env.NODE_ENV || "test"];

const sequelize = new Sequelize(config);

const TestQuestion = createQuestionModel(sequelize);
const TestAssignedQuestions = createAssignedQuestionsModel({
  s: sequelize,
  questionModel: TestQuestion,
});

describe("Question Service Endpoints", () => {
  beforeEach(async () => {
    try {
      await TestQuestion.sync({ force: true });
      await TestAssignedQuestions.sync({ force: true });
    } catch (e) {
      expect(e).toBe({});
    }
  });

  describe("POST /question", () => {
    it("should successfully create a new user", async () => {
      // Act
      const res = await requestWithSupertest.post("/api/question").send({
        difficulty: "EASY",
        title: "Two Sum",
        content:
          "Given an array of integers nums and an integer target, \
          return indices of the two numbers such that they add up to target. \
          \n\nYou may assume that each input would have exactly one solution, \
          and you may not use the same element twice.\n\nYou can return the \
          answer in any order.",
      });

      // Assert
      expect(res.status).toEqual(201);
      expect(res.body).toHaveProperty("qid");
      expect(res.body).toHaveProperty("difficulty", "EASY");
      expect(res.body).toHaveProperty("title", "Two Sum");
      expect(res.body).toHaveProperty(
        "content",
        "Given an array of integers nums and an integer target, \
          return indices of the two numbers such that they add up to target. \
          \n\nYou may assume that each input would have exactly one solution, \
          and you may not use the same element twice.\n\nYou can return the \
          answer in any order."
      );
      const question = await TestQuestion.findOne({
        where: { title: "Two Sum" },
      });
      expect(question).toBeTruthy();
      const { count } = await TestQuestion.findAndCountAll();
      expect(count).toBe(1);
    });

    it("should throw error when title is duplicated", async () => {
      // Arrange
      await TestQuestion.create({
        difficulty: "EASY",
        title: "Test title",
        content: "Test content1",
      });

      // Act
      const res = await requestWithSupertest.post("/api/question").send({
        difficulty: "EASY",
        title: "Test title",
        content: "Test content2",
      });

      // Assert
      expect(res.status).toEqual(409);
      const { count } = await TestQuestion.findAndCountAll({
        where: { title: "Test title", content: "Test content1" },
      });
      expect(count).toBe(1);
      const { count: total } = await TestQuestion.findAndCountAll();
      expect(total).toBe(1);
    });

    it("should fail when parameters are missing", async () => {
      // Act
      const res = await requestWithSupertest.post("/api/question").send({
        difficulty: "",
        title: "",
        content: "Test content2",
      });

      // Assert
      expect(res.status).toEqual(400);
      const { count } = await TestQuestion.findAndCountAll();
      expect(count).toBe(0);
    });
  });

  describe("POST /random-question", () => {
    it("should successfully fetch a question when no question has been assigned", async () => {
      // Arrange
      await TestQuestion.create({
        difficulty: "EASY",
        title: "Test title",
        content: "Test content1",
      });

      // Act
      const res = await requestWithSupertest
        .post("/api/random-question")
        .send({ matchId: "some-match-id", difficulty: "EASY" });

      // Assert
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty("qid");
      expect(res.body).toHaveProperty("difficulty");
      expect(res.body).toHaveProperty("title");
      expect(res.body).toHaveProperty("content");
      const { count: qn } = await TestQuestion.findAndCountAll();
      expect(qn).toBe(1);
      const { count: assigned } = await TestAssignedQuestions.findAndCountAll();
      expect(assigned).toBe(1);
    });

    it("should successfully fetch a question when question has already been assigned", async () => {
      try {
        // Arrange
        const qn = await TestQuestion.create({
          difficulty: "EASY",
          title: "Test title",
          content: "Test content1",
        });
        await TestAssignedQuestions.create({
          matchId: "some-match-id",
          qid: qn.qid,
        });

        // Act
        const res = await requestWithSupertest
          .post("/api/random-question")
          .send({ matchId: "some-match-id", difficulty: "EASY" });

        // Assert
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("qid");
        expect(res.body).toHaveProperty("difficulty");
        expect(res.body).toHaveProperty("title");
        expect(res.body).toHaveProperty("content");
        const { count: qnCount } = await TestQuestion.findAndCountAll();
        expect(qnCount).toBe(1);
        const { count: assignedCount } =
          await TestAssignedQuestions.findAndCountAll();
        expect(assignedCount).toBe(1);
      } catch (e) {
        expect(e).toBe(null);
      }
    });

    it("should throw error when difficulty is invalid", async () => {
      // Arrange
      await TestQuestion.create({
        difficulty: "EASY",
        title: "Test title",
        content: "Test content1",
      });

      // Act
      const res = await requestWithSupertest
        .post("/api/random-question")
        .send({ matchId: "some-match-id", difficulty: "SUPER EASY" });

      // Assert
      expect(res.status).toEqual(400);
      expect(
        await TestQuestion.findOne({
          where: { title: "Test title" },
        })
      ).toBeTruthy();
      const { count } = await TestQuestion.findAndCountAll();
      expect(count).toBe(1);
    });

    it("should throw error when difficulty is valid but not in database", async () => {
      // Arrange
      await TestQuestion.create({
        difficulty: "EASY",
        title: "Test title",
        content: "Test content1",
      });

      // Act
      const res = await requestWithSupertest
        .post("/api/random-question")
        .send({ matchId: "some-match-id", difficulty: "MEDIUM" });

      // Assert
      expect(res.status).toEqual(400);
      expect(
        await TestQuestion.findOne({
          where: { title: "Test title" },
        })
      ).toBeTruthy();
      const { count } = await TestQuestion.findAndCountAll();
      expect(count).toBe(1);
    });

    it("should throw error when difficulty is not provided", async () => {
      // Act
      const res = await requestWithSupertest
        .post("/api/random-question")
        .send({});

      // Assert
      expect(res.status).toEqual(400);
    });
  });

  describe("GET /questions", () => {
    it("should successfully fetch all questions", async () => {
      // Arrange
      await TestQuestion.bulkCreate([
        {
          difficulty: "EASY",
          title: "Test title",
          content: "Test content1",
        },
        {
          difficulty: "MEDIUM",
          title: "Test title2",
          content: "Test content2",
        },
      ]);

      // Act
      const res = await requestWithSupertest.get("/api/questions").send();

      // Assert
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(2);
      expect(res.body[0]).toHaveProperty("qid");
      expect(res.body[0]).toHaveProperty("difficulty");
      expect(res.body[0]).toHaveProperty("title");
      expect(res.body[0]).toHaveProperty("content");
      const { count } = await TestQuestion.findAndCountAll();
      expect(count).toBe(2);
    });

    it("should succeed even when there are no questions", async () => {
      // Act
      const res = await requestWithSupertest.get("/api/questions").send();

      // Assert
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(0);
      const { count } = await TestQuestion.findAndCountAll();
      expect(count).toBe(0);
    });
  });

  describe("POST /question-by-id", () => {
    it("should successfully fetch question by id", async () => {
      // Arrange
      await TestQuestion.create({
        difficulty: "EASY",
        title: "Test title",
        content: "Test content1",
      });
      const addedQn = await TestQuestion.findOne({
        where: { title: "Test title" },
      });

      // Act
      const res = await requestWithSupertest
        .post("/api/question-by-id")
        .send({ qid: addedQn.qid });

      // Assert
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty("qid");
      expect(res.body).toHaveProperty("difficulty");
      expect(res.body).toHaveProperty("title");
      expect(res.body).toHaveProperty("content");
      const { count } = await TestQuestion.findAndCountAll();
      expect(count).toBe(1);
    });

    it("should throw error when no ID is provided", async () => {
      // Act
      const res = await requestWithSupertest.post("/api/question-by-id").send();

      // Assert
      expect(res.status).toEqual(400);
      expect(res.body.message.toLowerCase().includes("missing")).toBeTruthy();
      const { count } = await TestQuestion.findAndCountAll();
      expect(count).toBe(0);
    });

    it("should throw error when invalid ID is provided", async () => {
      // Act
      const res = await requestWithSupertest
        .post("/api/question-by-id")
        .send({ qid: "invalid id" });

      // Assert
      expect(res.status).toEqual(400);
      expect(res.body.message.toLowerCase().includes("invalid")).toBeTruthy();
      const { count } = await TestQuestion.findAndCountAll();
      expect(count).toBe(0);
    });
  });

  describe("DELETE /question", () => {
    it("should successfully delete question", async () => {
      // Arrange
      await TestQuestion.create({
        difficulty: "EASY",
        title: "Test title",
        content: "Test content1",
      });

      // Act
      const question = await TestQuestion.findOne({
        where: { title: "Test title" },
      });
      const res = await requestWithSupertest
        .delete("/api/question")
        .send({ qid: question.qid });

      // Assert
      expect(res.status).toEqual(200);
      expect(
        await TestQuestion.findOne({ where: { title: "Test title" } })
      ).toBeNull();
      const { count } = await TestQuestion.findAndCountAll();
      expect(count).toBe(0);
    });

    it("should throw error when qid is not found in database", async () => {
      // Act
      const res = await requestWithSupertest
        .delete("/api/question")
        .send({ qid: "hello" });

      // Assert
      expect(res.status).toEqual(400);
      const { count } = await TestQuestion.findAndCountAll();
      expect(count).toBe(0);
    });

    it("should throw error when qid is not provided", async () => {
      // Act
      const res = await requestWithSupertest.delete("/api/question").send();

      // Assert
      expect(res.status).toEqual(400);
      const { count } = await TestQuestion.findAndCountAll();
      expect(count).toBe(0);
    });
  });
});
