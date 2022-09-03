require("dotenv/config");
const server = require("../index.js");
const supertest = require("supertest");
const requestWithSupertest = supertest(server.app);
const { Sequelize } = require("sequelize");
const createUserModel = require("../model/user-model");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: "postgres",
    logging: false,
  }
);

const TestUser = createUserModel(sequelize);

describe("User Endpoint", () => {
  afterEach(async () => await TestUser.truncate());

  describe("POST /user", () => {
    it("should successfully create a new user", async () => {
      // Act
      const res = await requestWithSupertest
        .post("/api/user")
        .send({ username: "TestUsername", password: "TestPassword" });

      // Assert
      expect(res.status).toEqual(201);
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername", password: "TestPassword" },
        })
      ).toBeTruthy();
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(1);
    });

    it("should throw error when username is duplicated", async () => {
      // Arrange
      await requestWithSupertest
        .post("/api/user")
        .send({ username: "TestUsername", password: "TestPassword1" });

      // Act
      const res = await requestWithSupertest
        .post("/api/user")
        .send({ username: "TestUsername", password: "TestPassword2" });

      // Assert
      expect(res.status).toEqual(409);
      const { count } = await TestUser.findAndCountAll({
        where: { username: "TestUsername" },
      });
      expect(count).toBe(1);
      const { count: total } = await TestUser.findAndCountAll();
      expect(total).toBe(1);
    });

    it("should succeed when password is duplicated", async () => {
      // Arrange
      await requestWithSupertest
        .post("/api/user")
        .send({ username: "TestUsername1", password: "TestPassword" });

      // Act
      const res = await requestWithSupertest
        .post("/api/user")
        .send({ username: "TestUsername2", password: "TestPassword" });

      // Assert
      expect(res.status).toEqual(201);
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername1", password: "TestPassword" },
        })
      ).toBeTruthy();
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername2", password: "TestPassword" },
        })
      ).toBeTruthy();
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(2);
    });
  });

  describe("GET /user", () => {
    it("should successfully log in a user", async () => {
      // Arrange
      await requestWithSupertest
        .post("/api/user")
        .send({ username: "TestUsername", password: "TestPassword" });

      // Act
      const res = await requestWithSupertest
        .get("/api/user")
        .send({ username: "TestUsername", password: "TestPassword" });

      // Assert
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty("username", "TestUsername");
      expect(res.body).toHaveProperty("password", "TestPassword");
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(1);
    });

    it("should throw error when username is not found in database", async () => {
      // Arrange
      await requestWithSupertest
        .post("/api/user")
        .send({ username: "TestUsername", password: "TestPassword" });

      // Act
      const res = await requestWithSupertest
        .get("/api/user")
        .send({ username: "TestUsername2", password: "TestPassword" });

      // Assert
      expect(res.status).toEqual(400);
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername", password: "TestPassword" },
        })
      ).toBeTruthy();
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername2", password: "TestPassword" },
        })
      ).toBeNull();
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(1);
    });

    it("should throw error when password is incorrect", async () => {
      // Arrange
      await requestWithSupertest
        .post("/api/user")
        .send({ username: "TestUsername", password: "TestPassword1" });

      // Act
      const res = await requestWithSupertest
        .get("/api/user")
        .send({ username: "TestUsername", password: "TestPassword2" });

      // Assert
      expect(res.status).toEqual(400);
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername", password: "TestPassword1" },
        })
      ).toBeTruthy();
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername", password: "TestPassword2" },
        })
      ).toBeNull();
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(1);
    });
  });

  describe("PATCH /user", () => {
    it("should successfully change password for user", async () => {
      // Arrange
      await requestWithSupertest
        .post("/api/user")
        .send({ username: "TestUsername", password: "TestPassword" });

      // Act
      const res = await requestWithSupertest.patch("/api/user").send({
        username: "TestUsername",
        currPassword: "TestPassword",
        newPassword: "TestPassword2",
      });

      // Assert
      expect(res.status).toEqual(200);
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername", password: "TestPassword2" },
        })
      ).toBeTruthy();
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername", password: "TestPassword" },
        })
      ).toBeNull();
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(1);
    });

    it("should succeed when username is in database but password is unchanged", async () => {
      // Arrange
      await requestWithSupertest
        .post("/api/user")
        .send({ username: "TestUsername", password: "TestPassword" });

      // Act
      const res = await requestWithSupertest.patch("/api/user").send({
        username: "TestUsername",
        currPassword: "TestPassword",
        newPassword: "TestPassword",
      });

      // Assert
      expect(res.status).toEqual(202);
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername", password: "TestPassword" },
        })
      ).toBeTruthy();
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(1);
    });

    it("should throw error when username is not found in database", async () => {
      // Arrange
      await requestWithSupertest
        .post("/api/user")
        .send({ username: "TestUsername", password: "TestPassword" });

      // Act
      const res = await requestWithSupertest.patch("/api/user").send({
        username: "TestUsername1",
        currPassword: "TestPassword",
        newPassword: "TestPassword2",
      });

      // Assert
      expect(res.status).toEqual(400);
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername", password: "TestPassword" },
        })
      ).toBeTruthy();
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername1", password: "TestPassword" },
        })
      ).toBeNull();
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(1);
    });

    it("should throw error when old password is incorrect", async () => {
      // Arrange
      await requestWithSupertest
        .post("/api/user")
        .send({ username: "TestUsername", password: "TestPassword" });

      // Act
      const res = await requestWithSupertest.patch("/api/user").send({
        username: "TestUsername",
        currPassword: "TestPassword1",
        newPassword: "TestPassword2",
      });

      // Assert
      expect(res.status).toEqual(400);
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername", password: "TestPassword" },
        })
      ).toBeTruthy();
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername", password: "TestPassword2" },
        })
      ).toBeNull();
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(1);
    });
  });

  describe("DELETE /user", () => {
    it("should successfully delete user", async () => {
      // Arrange
      await requestWithSupertest
        .post("/api/user")
        .send({ username: "TestUsername", password: "TestPassword" });

      // Act
      const res = await requestWithSupertest
        .delete("/api/user")
        .send({ username: "TestUsername", password: "TestPassword" });

      // Assert
      expect(res.status).toEqual(200);
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername", password: "TestPassword" },
        })
      ).toBeNull();
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(0);
    });

    it("should throw error when username is not found in database", async () => {
      // Arrange
      await requestWithSupertest
        .post("/api/user")
        .send({ username: "TestUsername", password: "TestPassword" });

      // Act
      const res = await requestWithSupertest
        .delete("/api/user")
        .send({ username: "TestUsername2", password: "TestPassword" });

      // Assert
      expect(res.status).toEqual(400);
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername", password: "TestPassword" },
        })
      ).toBeTruthy();
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername2", password: "TestPassword" },
        })
      ).toBeNull();
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(1);
    });

    it("should throw error when password is incorrect", async () => {
      // Arrange
      await requestWithSupertest
        .post("/api/user")
        .send({ username: "TestUsername", password: "TestPassword" });

      // Act
      const res = await requestWithSupertest
        .delete("/api/user")
        .send({ username: "TestUsername", password: "TestPassword2" });

      // Assert
      expect(res.status).toEqual(400);
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername", password: "TestPassword" },
        })
      ).toBeTruthy();
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername", password: "TestPassword2" },
        })
      ).toBeNull();
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(1);
    });
  });
});
