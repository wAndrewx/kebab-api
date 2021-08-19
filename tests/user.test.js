const seed = require("./utils/userSeeding");
const app = require("../app");
const supertest = require("supertest");
const user = require("../model/user");
const mongoose = require("mongoose");
const req = supertest(app);

describe("User Login /POST", () => {
  beforeAll(async () => {
    await user.deleteMany({});
    await user.create([seed.goodUserRegister, seed.unverified]);
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("should fail since does not exist user ", () => {
    req.post("/api/login").send(seed.nonExistantUser).expect(400);
  });
  test("should fail since unverified user ", () => {
    req.post("/api/login").send(seed.unverified).expect(403);
  });
  test("should fail wrong password ", () => {
    req
      .post("/api/login")
      .send({
        username: seed.goodUserRegister.username,
        password: "wrongpassword",
      })
      .expect(406);
  });
  test("should fail since empty fields ", () => {
    req.post("/api/login").send().expect(406);
  });
  test("should successfully login ", () => {
    req.post("/api/login").send(seed.goodUser).expect(202);
  });
});

// describe("User register /POST", () => {
//   test("should fail, existing email ", () => {});
//   test("should fail, existing username ", () => {});
//   test("should fail, empty fields ", () => {});
//   test("should fail password is too short ", () => {});
//   test("should successfully register ", () => {});
// });
