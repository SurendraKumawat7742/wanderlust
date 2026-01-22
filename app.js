// if(process.env.NODE_ENV != "production"){
//     require("dotenv").config();
// }
// console.log(process.env.SECRET);

// const express = require("express");
// // import express, { urlencoded, static } from "express";
// // import express, { urlencoded, static } from "express";
// const app = express();
// import join from "path";
// // import { connect } from "mongoose";
// import methodOverride from "method-override";
// import ejsMate from "ejs-mate";
// import ExpressError from "./utils/ExpressError.js";
// import session from "express-session";
// // import MongoStore from "connect-mongo";
// import flash from "connect-flash";
// // import { initialize, session as _session, use, serializeUser, deserializeUser } from "passport";
// import passport from "passport";
// import LocalStrategy from "passport-local";
// // import { authenticate, serializeUser as _serializeUser, deserializeUser as _deserializeUser } from "./models/user.js";
// import User from "./models/user.js";

// import listingRouter from "./routes/listing.js";
// import reviewRouter from "./routes/review.js";
// import userRouter from "./routes/user.js";
// import propertyRoutes from './routes/property.js';

// app.set("view engine","ejs");
// app.set("views",join(__dirname,"views"));
// app.use(express.urlencoded({extended:true}));
// app.use(methodOverride("_method"));
// app.engine("ejs",ejsMate);
// app.use(express.static(join(__dirname,"/public")))

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl = process.env.ATLASDB_URL;

// main().
//  then((res)=>{
//     console.log("connected to DB");
//  }).catch((err)=>{
//     console.log(err);
//  })
// async function main(){
//     await mongoose.connect(dbUrl);
// }

// const store = create({
//     mongoUrl: dbUrl,
//     crypto: {
//         secret: process.env.SECRET
//     },
//     touchAfter: 24*3600
// })

// store.on("error",()=>{
//     console.log("ERROR IN MONGO SESSION STORE",err);
// })
// //Express session
// const sessionOptions = {
//     store,
//     secret : process.env.SECRET,
//     resave : false,
//     saveUninitialized : true,
//     cookie : {
//         expires: Date.now() + 7*24*60*60*1000,
//         maxAge : 7*24*60*60*1000,
//         httpOnly : true,
//     }
// }

// app.use(session(sessionOptions));
// app.use(flash());

// //Passport
// app.use(initialize());
// app.use(_session());
// use(new LocalStrategy(authenticate()));

// // use static serialize and deserialize of model for passport session support
// serializeUser(_serializeUser());
// deserializeUser(_deserializeUser());

// app.use((req,res,next)=>{
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     res.locals.currUser = req.user;
//     next();
// })

// // //Passport
// // app.get("/demouser",async (req,res)=>{
// //     let fakeUser = new User({
// //         email: "surendra77@gmail.com",
// //         username: "surendra",
// //     })
// //     let registeredUser = await User.register(fakeUser, "helloworld");
// //     res.send(registeredUser);
// // })

// app.use("/listings", listingRouter);
// app.use("/listings/:id/reviews", reviewRouter);
// app.use("/",userRouter);
// app.use('/', propertyRoutes);

// //If route not exists
// app.all('*catchall',(req,res,next)=>{
//     next(new ExpressError(404,"page not found!"));
// });
// //Error handling middleware
// app.use((err,req,res,next)=>{
//     let {status=500,message="something went wrong"} = err;
//     res.status(status).render("error.ejs",{message});
//     // res.status(status).send(message);
// })

// app.listen(8080,()=>{
//     console.log("server is listening to port 8080");
// })







if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const propertyRoutes = require("./routes/property.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const MONGODB_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl);
}
main()
    .then(() => console.log("connected to DB"))
    .catch((err) => console.log(err));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (error) => {
    console.log("ERROR IN MONGO SESSION STORE", error);
});

// Express session
const sessionOptions = {
    store,
    secret: process.env.SECRET || "mysecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/", propertyRoutes);

// If route not exists
app.all("*catchall", (req, res, next) => {
    next(new ExpressError(404, "page not found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "something went wrong" } = err;
    res.status(status).render("error.ejs", { message,
        error: res.locals.error,
        success: res.locals.success
     });
});

app.listen(5000, () => {
    console.log("server is listening to port 5000");
});












// if (process.env.NODE_ENV != "production") {
//   require("dotenv").config();
// }

// const express = require("express");
// const app = express();
// const port = 8080;
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const ExpressError = require("./utils/ExpressError.js");
// const listingRouter = require("./routes/listing.js");
// const reviewRouter = require("./routes/review.js");
// const userRouter = require("./routes/user.js");
// const session = require("express-session");
// const MongoStore = require("connect-mongo");
// const flash = require("connect-flash");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user.js");
// // const Booking = require("./models/booking.js");
// const Listing = require("./models/listing.js");
// // const booking = require("./models/booking.js");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const dburl = process.env.ATLASDB_URL;

// main()
//   .then((res) => {
//     console.log("connection successful");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await connect(dburl);
// }

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.engine("ejs", ejsMate);
// app.use(express.static(path.join(__dirname, "/public")));

// //mongo-sessio
// const store = MongoStore.create({
//   mongoUrl: dburl,
//   crypto: {
//     secret: process.env.SECRET,
//   },
//   touchAfter: 24 * 3600,
// });
// store.on("error", () => {
//   console.log("ERROR in MONGO SESSION STORE", err);
// });

// //Express-session
// const sessionOptions = {
//   store,
//   secret: process.env.SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     httpOnly: true,
//   },
// };

// app.use(session(sessionOptions));
// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// //method for passport
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// //middleware for flash
// app.use((req, res, next) => {
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   res.locals.currentUser = req.user;
//   next();
// });

// //for reconstructing routes
// app.use("/listings", listingRouter);
// app.use("/listings/:id/reviews", reviewRouter);
// // app.use("/listings/:id/booking", reviewRouter);
// app.use("/", userRouter);
// //wrong request
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page not found!"));
// });

// //ErrorHandling
// app.use((err, req, res, next) => {
//   let { status = 500, message = "something went wrong!" } = err;
//   res.render("./listings/error.ejs", { message });
// });



// //port starter
// app.listen(port, (req, res) => {
//   console.log(`port is listening ${port}`);
// });

