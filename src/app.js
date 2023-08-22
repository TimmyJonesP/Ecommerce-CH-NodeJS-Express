import express from "express";
import mongoConnect from "../db/index.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { mongoSECRET, mongoURL } from "./config/db.config.js";
import { __dirname } from "./utils/path.utils.js";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
import router from "./router/index.js";

const app = express();

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: mongoURL,
      dbName: "sessions",
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
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

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

mongoConnect();
router(app);

export default app;
