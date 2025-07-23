const User = require("../models/user.js");

module.exports.renderSignup = (req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signup = async (req,res,next)=>{
    try{
        let {username, email, password} = req.body;
        let newUser = new User({email, username});
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to wanderlust");
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}
module.exports.renderLogin = (req,res)=>{
    res.render("users/login.ejs");
}
module.exports.login = async (req,res)=>{
    req.flash("success","Welcome back to wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings"; // use a sensible default
    // delete req.session.redirectUrl; // optional: clean up
    res.redirect(redirectUrl);
}
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
}