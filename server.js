"use strict";

let express = require("express"),
    app = express(),
    path = require("path"),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    passport = require("passport"),
    neo4j = require("neo4j");

const secrets = require("./config/secrets.js");
const db = new neo4j.GraphDatabase(secrets.neo4jURL);

app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");

// passport stuff
require('./config/passport')(passport, db);
app.use(session({ secret: secrets.sessionSecret }));
app.use(passport.initialize());
app.use(passport.session());


const createNewUserQuery = "CREATE (u:User {fbid: {fbid}, signedIn: true, lastQuery: ''})";
const findUserQuery = "MATCH (u:User) WHERE u.fbid = {fbid}";
const createRelationshipQuery = `MATCH (ua:User),(ub:User) WHERE ua.fbid = {fbid_a} AND ub.fbid = {fbid_b}
    CREATE (ua)-[f:FRIENDS_WITH]->(ub)`;

require('./config/routes.js')(app, passport);

app.listen(4000);