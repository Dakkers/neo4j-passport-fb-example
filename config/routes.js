module.exports = function(app, passport) {

    app.get('/friendly', function(req, res) {
        if (req.isAuthenticated())
            res.render("index", {login: true});
        else
            res.render("index", {login: false});
    });

    // route for facebook authentication and login
    app.get('/friendly/authenticate', passport.authenticate('facebook', { scope : 'user_friends' }));

    // handle the callback after facebook has authenticated the user
    app.get('/friendly/authenticate/callback',
        passport.authenticate('facebook', {
            successRedirect : '/friendly',
            failureRedirect : '/friendly'
        }));

    // route for logging out
    app.get('/friendly/logout', function(req, res) {
        req.logout();
        res.redirect('/friendly');
    });

};
