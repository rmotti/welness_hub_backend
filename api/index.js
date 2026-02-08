import express from 'express';
import db from './models/index.js';
import userRoute from './routes/user.route.js';
import exampleRoute from './routes/example.route.js';



db.sequelize.sync()
    .then(() => {
        console.log("Database synced successfully.");
    })
    .catch((error) => {
        console.error("Error syncing database:", error);
    });


const app = express();


app.use(express.json());


app.use("/users", userRoute);
app.use("/secureExampleRoute", exampleRoute);

app.get('/', (req, res) => {
    res.send({message:'API Started'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server is running on port http://localhost:${PORT}/`);
});

