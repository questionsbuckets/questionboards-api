import express from "express";
import cors from "cors";
import type { CorsOptions } from "cors";
import path, { dirname } from "path";
import "dotenv/config";
import type { TTokenUser } from "./utils/Enums.utils.js";
import { DbInstance } from "./config/db.config.js";
import router from "./services/routes.js";
import { fileURLToPath } from "url";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/errorHandler.middleware.js";
import session from "express-session";
import passport from "passport";
import "./utils/passport-config.utils.js";
import { seedGrades, seedSubTopic, seedtopic } from "./utils/seeder.utils.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const sessionSecret = process.env.SESSION_SECRET;

const allowedOrigins = [
  process.env.FRONTEND_BASE_URL!,
  process.env.FRONTEND_BASE_LIVE_URL!,
];

if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push(
    "http://localhost:3000",
    "http://192.168.12.212:3000",
    "http://localhost:3001",
    "http://localhost:5500"
  );
}

const corsOption: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

app.use(
  session({
    secret: sessionSecret as string,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(cors(corsOption));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));

//For checking the server health :
app.get("/health", (req, res) => {
  res.send(`Server is up and running!!!`);
});

app.use("/api/v1", router);
app.use(notFoundHandler);
app.use(errorHandler);

DbInstance.then(async () => {
  console.log("Database Connected 🦊");
  // await seedGrades();
  // await seedtopic();
  // await seedSubTopic();
  app.listen(port, async () => {
    console.log(`🚀 Server is running on port 🚀: ${port}`);
  });
}).catch((err: any) => {
  console.log(`Can't Connect Server!`, err);
  process.exit(1);
});

declare global {
  namespace Express {
    interface Request {
      userData?: TTokenUser | undefined;
    }
  }
}
