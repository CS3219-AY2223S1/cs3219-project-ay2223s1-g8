require("dotenv/config");
const server = require("./index.js");
const supertest = require("supertest");
const requestWithSupertest = supertest(server.app);
const { Sequelize } = require("sequelize");
const createQuestionModel = require("./model/question-model");
const config = require("./config/config")[process.env.NODE_ENV || "test"];

const sequelize = new Sequelize(config);

const TestQuestion = createQuestionModel(sequelize);

describe("Question Service Endpoints", () => {
  afterEach(async () => await TestQuestion.truncate());

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

  describe("GET /question", () => {
    it("should successfully fetch a question", async () => {
      // Arrange
      await TestQuestion.create({
        difficulty: "EASY",
        title: "Test title",
        content: "Test content1",
      });

      // Act
      const res = await requestWithSupertest
        .get("/api/question")
        .send({ difficulty: "EASY" });

      // Assert
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty("qid");
      expect(res.body).toHaveProperty("difficulty");
      expect(res.body).toHaveProperty("title");
      expect(res.body).toHaveProperty("content");
      const { count } = await TestQuestion.findAndCountAll();
      expect(count).toBe(1);
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
        .get("/api/question")
        .send({ difficulty: "SUPER EASY" });

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
        .get("/api/question")
        .send({ difficulty: "MEDIUM" });

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
      const res = await requestWithSupertest.get("/api/question").send({});

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
