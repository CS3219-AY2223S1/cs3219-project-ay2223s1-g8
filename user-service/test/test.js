require("dotenv/config");
const server = require("../index.js");
const supertest = require("supertest");
const requestWithSupertest = supertest(server.app);
// const { Sequelize } = require("sequelize");
const createUserModel = require("../model/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
// const config = require("../config/config")[process.env.NODE_ENV || "test"];

// const sequelize = new Sequelize(config);

const TestUser = createUserModel();

describe("User Service Endpoints", () => {
  beforeAll(async () => {
    try {
      await TestUser.sync();
    } catch (e) {
      expect(e).toBe({});
    }
  });

  afterEach(async () => {
    try {
      await TestUser.truncate();
    } catch (e) {
      expect(e).toBe({});
    }
  });

  describe("POST /user-api/username", () => {
    it("should return true if username is in database", async () => {
      // Arrange
      await TestUser.create({
        username: "TestUsername",
        password: await bcrypt.hash("TestPassword", 10),
      });

      // Act
      const res = await requestWithSupertest
        .post("/user-api/username")
        .send({ username: "TestUsername" });

      // Assert
      expect(res.status).toEqual(200);
      expect(res.body).toEqual(true);
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername" },
        })
      ).toBeTruthy();
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(1);
    });

    it("should return false if username is not in database", async () => {
      // Act
      const res = await requestWithSupertest
        .post("/user-api/username")
        .send({ username: "TestUsername" });

      // Assert
      expect(res.status).toEqual(200);
      expect(res.body).toEqual(false);
    });

    it("should throw error when username is missing", async () => {
      // Act
      const res = await requestWithSupertest.post("/user-api/username").send();

      // Assert
      expect(res.status).toEqual(400);
    });
  });

  describe("POST /user-api/user", () => {
    it("should successfully create a new user", async () => {
      // Act
      const res = await requestWithSupertest
        .post("/user-api/user")
        .send({ username: "TestUsername", password: "TestPassword" });

      // Assert
      expect(res.status).toEqual(201);
      expect(res.body).toHaveProperty("username", "TestUsername");
      expect(res.body).toHaveProperty("token");
      expect(jwtDecode(res.body.token).id).toBeTruthy();
      const user = await TestUser.findOne({
        where: { username: "TestUsername" },
      });
      expect(user).toBeTruthy();
      expect(
        await bcrypt.compare("TestPassword", user.dataValues.password)
      ).toBeTruthy();
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(1);
    });

    it("should throw error when username is duplicated", async () => {
      // Arrange
      await TestUser.create({
        username: "TestUsername",
        password: await bcrypt.hash("TestPassword1", 10),
      });

      // Act
      const res = await requestWithSupertest
        .post("/user-api/user")
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
      await TestUser.create({
        username: "TestUsername1",
        password: await bcrypt.hash("TestPassword", 10),
      });

      // Act
      const res = await requestWithSupertest
        .post("/user-api/user")
        .send({ username: "TestUsername2", password: "TestPassword" });

      // Assert
      expect(res.status).toEqual(201);
      expect(res.body).toHaveProperty("username", "TestUsername2");
      expect(res.body).toHaveProperty("token");
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername1" },
        })
      ).toBeTruthy();
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername2" },
        })
      ).toBeTruthy();
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(2);
    });
  });

  describe("POST /user-api/session", () => {
    it("should successfully log in a user", async () => {
      // Arrange
      await TestUser.create({
        username: "TestUsername",
        password: await bcrypt.hash("TestPassword", 10),
      });

      // Act
      const res = await requestWithSupertest
        .post("/user-api/session")
        .send({ username: "TestUsername", password: "TestPassword" });

      // Assert
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty("username", "TestUsername");
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("userId");
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(1);
    });

    it("should throw error when username is not found in database", async () => {
      // Arrange
      await TestUser.create({
        username: "TestUsername",
        password: await bcrypt.hash("TestPassword", 10),
      });

      // Act
      const res = await requestWithSupertest
        .post("/user-api/session")
        .send({ username: "TestUsername2", password: "TestPassword" });

      // Assert
      expect(res.status).toEqual(400);
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername" },
        })
      ).toBeTruthy();
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(1);
    });

    it("should throw error when password is incorrect", async () => {
      // Arrange
      await TestUser.create({
        username: "TestUsername",
        password: await bcrypt.hash("TestPassword1", 10),
      });

      // Act
      const res = await requestWithSupertest
        .post("/user-api/session")
        .send({ username: "TestUsername", password: "TestPassword2" });

      // Assert
      expect(res.status).toEqual(400);
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername" },
        })
      ).toBeTruthy();
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(1);
    });
  });

  describe("PATCH /user-api/user", () => {
    it("should successfully change password for user", async () => {
      // Arrange
      await TestUser.create({
        username: "TestUsername",
        password: await bcrypt.hash("TestPassword", 10),
      });

      // Act
      const addedUser = await TestUser.findOne({
        where: { username: "TestUsername" },
      });
      const token = jwt.sign({ id: addedUser.userId }, process.env.TOKEN_KEY, {
        expiresIn: "2h",
      });
      const res = await requestWithSupertest.patch("/user-api/user").send({
        token,
        currPassword: "TestPassword",
        newPassword: "TestPassword2",
      });

      // Assert
      expect(res.status).toEqual(200);
      const user = await TestUser.findOne({
        where: { username: "TestUsername" },
      });
      expect(user).toBeTruthy();
      expect(
        await bcrypt.compare("TestPassword2", user.dataValues.password)
      ).toBeTruthy();
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(1);
    });

    it("should succeed when username is in database but password is unchanged", async () => {
      // Arrange
      await TestUser.create({
        username: "TestUsername",
        password: await bcrypt.hash("TestPassword", 10),
      });

      // Act
      const addedUser = await TestUser.findOne({
        where: { username: "TestUsername" },
      });
      const token = jwt.sign({ id: addedUser.userId }, process.env.TOKEN_KEY, {
        expiresIn: "2h",
      });
      const res = await requestWithSupertest.patch("/user-api/user").send({
        token,
        currPassword: "TestPassword",
        newPassword: "TestPassword",
      });

      // Assert
      expect(res.status).toEqual(202);
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(1);
    });

    it("should throw error when username is not found in database", async () => {
      // Arrange
      await TestUser.create({
        username: "TestUsername",
        password: await bcrypt.hash("TestPassword", 10),
      });

      // Act
      const token = jwt.sign({ id: null }, process.env.TOKEN_KEY, {
        expiresIn: "2h",
      });
      const res = await requestWithSupertest.patch("/user-api/user").send({
        token,
        currPassword: "TestPassword",
        newPassword: "TestPassword2",
      });

      // Assert
      expect(res.status).toEqual(400);
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername" },
        })
      ).toBeTruthy();
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(1);
    });

    it("should throw error when old password is incorrect", async () => {
      // Arrange
      await TestUser.create({
        username: "TestUsername",
        password: await bcrypt.hash("TestPassword", 10),
      });

      // Act
      const addedUser = await TestUser.findOne({
        where: { username: "TestUsername" },
      });
      const token = jwt.sign({ id: addedUser.userId }, process.env.TOKEN_KEY, {
        expiresIn: "2h",
      });
      const res = await requestWithSupertest.patch("/user-api/user").send({
        token,
        currPassword: "TestPassword1",
        newPassword: "TestPassword2",
      });

      // Assert
      expect(res.status).toEqual(400);
      const user = await TestUser.findOne({
        where: { username: "TestUsername" },
      });
      expect(user).toBeTruthy();
      expect(
        await bcrypt.compare("TestPassword", user.dataValues.password)
      ).toBeTruthy();
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(1);
    });
  });

  describe("DELETE /user-api/user", () => {
    it("should successfully delete user", async () => {
      // Arrange
      await TestUser.create({
        username: "TestUsername",
        password: await bcrypt.hash("TestPassword", 10),
      });

      // Act
      const addedUser = await TestUser.findOne({
        where: { username: "TestUsername" },
      });
      const token = jwt.sign({ id: addedUser.userId }, process.env.TOKEN_KEY, {
        expiresIn: "2h",
      });
      const res = await requestWithSupertest
        .delete("/user-api/user")
        .send({ token });

      // Assert
      expect(res.status).toEqual(200);
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername" },
        })
      ).toBeNull();
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(0);
    });

    it("should throw error when username is not found in database", async () => {
      // Arrange
      await TestUser.create({
        username: "TestUsername",
        password: await bcrypt.hash("TestPassword", 10),
      });

      // Act
      const token = jwt.sign({ id: null }, process.env.TOKEN_KEY, {
        expiresIn: "2h",
      });
      const res = await requestWithSupertest
        .delete("/user-api/user")
        .send({ token });

      // Assert
      expect(res.status).toEqual(400);
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername" },
        })
      ).toBeTruthy();
      expect(
        await TestUser.findOne({
          where: { username: "TestUsername2" },
        })
      ).toBeNull();
      const { count } = await TestUser.findAndCountAll();
      expect(count).toBe(1);
    });
  });
});
