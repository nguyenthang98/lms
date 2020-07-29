const express = require('express');
const app = express();
const config = require("config");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

(({ host, port, db, uname, pwd, authSource }) => {
    const uri = `mongodb://${host}:${port}/${db}`;
    const options = {
        useNewUrlParser: true,
        authSource: authSource,
        user: uname,
        pass: pwd,
        autoReconnect: true,
        reconnectTries: 20,
        reconnectInterval: 2000
    }

    const connectToMongo = function() {
        console.info(`try to connect to mongo with uri: ${uri}`);
        mongoose
            .connect(uri, options)
            .then((connection) => {
                console.info("connected to mongo");
            })
            .catch(err => {
                console.info("error when connect to db", err.message);
                // setTimeout(connectToMongo, 2000);
            });
    }
    connectToMongo();
})(config.get("dbConfig"));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => res.send('Hello Thang!'));

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const {verifyToken} = require("./controller/auth");
// app.use(verifyToken)

const routes = require("./routes");
app.use("/api", verifyToken, routes);

module.exports = app;
