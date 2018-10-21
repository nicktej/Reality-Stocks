const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

var app = express();

// BodyParser middleware
// https://github.com/expressjs/body-parser#expressconnect-top-level-generic
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Host static files
app.use(express.static(path.join(__dirname, "client/build")));

// API route
app.use("/api", require("./router-api"));

// Always redirect to index file
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "client/build/index.html")));

// General error handler
app.use((err, req, res, next) => {
    console.log("[ERROR]", err);

    if (typeof err == "string") {
        err = {
            message: err
        }
    }

    if (err instanceof Error) {
        return res.status(err.status || 500).send(err); // Default to internal server error
    }

    err.success = false;
    res.status(err.status || 200).json(err);
});

const PORT = 5000;

var server = app.listen(PORT, () => {
    var address = server.address();
    console.log("Web server listening at http://" + address.address + ":" + address.port);
});