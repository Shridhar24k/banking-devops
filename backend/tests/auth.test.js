const request = require("supertest");
const express = require("express");

const app = express();

app.use(express.json());

app.post("/api/auth/register", (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    res.status(201).json({
        message: "Registration successful"
    });
});


describe("Registration API", () => {

    test("should reject empty registration", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({});

        expect(response.statusCode).toBe(400);

    });

});