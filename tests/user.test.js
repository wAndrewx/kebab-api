const seed = require("./utils/userSeeding");
const app = require("../app");
const supertest = require("supertest");
const user = require("../model/user");
const mongoose = require("mongoose");
const req = supertest(app);
beforeAll(async () => {
  await user.deleteMany({});
  await user.create([seed.goodUserRegister, seed.unverified]);
});
afterAll(async () => {
  await mongoose.connection.close();
});
describe("User Login /POST", () => {
  test("should fail since does not exist user ", async () => {
    const res = await req
      .post("/api/login")
      .send(seed.nonExistantUser)
      .expect(400);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("message", "User does not exist");
  });

  test("should fail since unverified user ", async () => {
    const res = await req
      .post("/api/login")
      .send({ username: seed.unverified.username, password: "password123" })
      .expect(403);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("message", "Please verify your account");
  });

  test("should fail wrong password ", async () => {
    const res = await req
      .post("/api/login")
      .send({
        username: seed.goodUserRegister.username,
        password: "wrongpass",
      })
      .expect(406);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("message", "Wrong password");
  });

  test("should fail since empty fields ", async () => {
    const res = await req.post("/api/login").send().expect(406);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("message", "Fill in the fields");
  });

  test("should successfully login ", async () => {
    const res = await req.post("/api/login").send(seed.goodUser).expect(202);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("message", "Succesfully logged in");
    expect(res.body.token).toBeDefined();
  });
});

describe("User register /POST", () => {
  test("should fail, empty fields ", async () => {
    const res = await req.post("/api/register").send().expect(406);
    expect(res.body).toBeDefined();
    expect(res.body.message).toBeDefined();
    expect(res.body).toHaveProperty("message", "Fill in the fields");
  });
  test("should fail, existing username ", async () => {
    const res = await req.post("/api/register").send(seed.goodUser).expect(406);
    expect(res.body).toBeDefined();
    expect(res.body.message).toBeDefined();
    expect(res.body).toHaveProperty(
      "message",
      "Please choose a different user name"
    );
  });
  test("should fail, existing email ", async () => {
    const res = await req
      .post("/api/register")
      .send({ ...seed.goodUser, username: "fakeusername" })
      .expect(406);
    expect(res.body).toBeDefined();
    expect(res.body.message).toBeDefined();
    expect(res.body).toHaveProperty("message", "Use a different email");
  });
  test("should fail password is too short ", async () => {
    const res = await req
      .post("/api/register")
      .send({ ...seed.nonExistantUser, password: "short" })
      .expect(406);
    expect(res.body).toBeDefined();
    expect(res.body.message).toBeDefined();
    expect(res.body).toHaveProperty("message", "Password is too short");
  });
  test("should successfully register ", async () => {
    const res = await req
      .post("/api/register")
      .send(seed.nonExistantUser)
      .expect(201);
    // console.log(res.body);
    expect(res.body).toBeDefined();
    expect(res.body.message).toBeDefined();
    expect(res.body).toHaveProperty(
      "message",
      "Account created, verify your email"
    );
  });
});
