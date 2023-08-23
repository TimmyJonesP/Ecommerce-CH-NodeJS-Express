import express from "express";
import mongoConnect from "../db/index.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { mongoSECRET, mongoURL } from "./config/db.config.js";
import { __dirname } from "./utils/path.utils.js";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
import router from "./router/index.js";
import * as path from "path";
import initializePassport from "./config/passport.config/passport.config.js";
import passport from "passport";
import { engine } from "express-handlebars";

const app = express();

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: mongoURL,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      collectionName: "sessions",
    }),
    secret: `${mongoSECRET}`,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

mongoConnect();
router(app);

export default app;
