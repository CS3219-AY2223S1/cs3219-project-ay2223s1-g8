require("dotenv/config");
const server = require("../index.js");
const supertest = require("supertest");
const requestWithSupertest = supertest(server.app);
const { Sequelize } = require("sequelize");
const createUserModel = require("../model/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const config = require("../config/config")[process.env.NODE_ENV || "test"];

const sequelize = new Sequelize(config);

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
      expect(res.body).toHaveProperty("username", "TestUsername");
      expect(res.body).toHaveProperty("token");
      expect(jwtDecode(res.body.token).username).toBe("TestUsername");
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
      await TestUser.create({
        username: "TestUsername1",
        password: await bcrypt.hash("TestPassword", 10),
      });

      // Act
      const res = await requestWithSupertest
        .post("/api/user")
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

  describe("GET /user", () => {
    it("should successfully log in a user", async () => {
      // Arrange
      await TestUser.create({
        username: "TestUsername",
        password: await bcrypt.hash("TestPassword", 10),
      });

      // Act
      const res = await requestWithSupertest
        .get("/api/user")
        .send({ username: "TestUsername", password: "TestPassword" });

      // Assert
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty("username", "TestUsername");
      expect(res.body).toHaveProperty("token");
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
        .get("/api/user")
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
        .get("/api/user")
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

  describe("PATCH /user", () => {
    it("should successfully change password for user", async () => {
      // Arrange
      await TestUser.create({
        username: "TestUsername",
        password: await bcrypt.hash("TestPassword", 10),
      });

      // Act
      const token = jwt.sign(
        { username: "TestUsername" },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      const res = await requestWithSupertest.patch("/api/user").send({
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
      const token = jwt.sign(
        { username: "TestUsername" },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      const res = await requestWithSupertest.patch("/api/user").send({
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
      const token = jwt.sign(
        { username: "TestUsername1" },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      const res = await requestWithSupertest.patch("/api/user").send({
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
      const token = jwt.sign(
        { username: "TestUsername" },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      const res = await requestWithSupertest.patch("/api/user").send({
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

  describe("DELETE /user", () => {
    it("should successfully delete user", async () => {
      // Arrange
      await TestUser.create({
        username: "TestUsername",
        password: await bcrypt.hash("TestPassword", 10),
      });

      // Act
      const token = jwt.sign(
        { username: "TestUsername" },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      const res = await requestWithSupertest
        .delete("/api/user")
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
      const token = jwt.sign(
        { username: "TestUsername2" },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      const res = await requestWithSupertest
        .delete("/api/user")
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
