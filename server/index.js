import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import student_accRoute from "./routes/student_accRoute.js";
import quiz_historyRoute from "./routes/quiz_historyRoute.js";
import questionRoute from "./routes/questionRoutes.js";
import answerRoute from "./routes/answerRoute.js";
import leaderboardRoute from "./routes/leaderboardRoute.js";
import authRoute from "./routes/authRoute.js";
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

//(async()=>{
//    await db.sync();
//})();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(student_accRoute);
app.use(quiz_historyRoute);
app.use(questionRoute);
app.use(answerRoute);
app.use(leaderboardRoute);
app.use(authRoute);

//store.sync();

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running...');
});
