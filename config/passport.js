"use strict";

const secrets = require('./secrets');
const FacebookStrategy = require('passport-facebook').Strategy;
const findUserQuery = "MATCH (u:User) WHERE u.fbid = {fbid} RETURN u";
const updateSigninQuery = "MATCH (u:User) WHERE u.fbid = {fbid} SET u.signedIn = true";
const createUserQuery = "CREATE (u:User {fbid: {fbid}, token: {token}, signedIn: true}) RETURN u";

module.exports = function(passport, db) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        // console.log(user);
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
    
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : secrets.appID,
        clientSecret    : secrets.appSecret,
        callbackURL     : secrets.callbackURL

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
        process.nextTick(function() {

            db.query(findUserQuery, {"fbid": profile.id}, function(err, users) {
                if (users.length) {
                    let user = users[0];
                    console.log(profile.id + " has done a thing")
                    if (!user.u.data.signedIn)
                        db.query(updateSigninQuery, {"fbid": profile.id}, function() {});
                    return done(null, users[0]);
                } else {
                    console.log(profile.id + " has just signed up.");
                    db.query(createUserQuery, {"fbid": profile.id, "token": token}, function(err, users) {
                        return done(null, users[0]);
                    });
                }
            });
        });
    }));
};
