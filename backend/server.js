const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173", // frontend dev server URL
    credentials: true,
  })
);
