const request = require("supertest");

const express = require("express");

const app = express();

app.get("/health", (req, res) => {
    res.json({
        status: "UP"
    });
});

describe("Health API", () => {

    test("should return UP", async () => {

        const response = await request(app)
            .get("/health");

        expect(response.statusCode).toBe(200);

        expect(response.body.status).toBe("UP");

    });

});