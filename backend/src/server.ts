
import "dotenv/config";

import app from "./app.js";
import config from "./config/index.js";

const port = Number(config.port ?? 5000);

app.listen(port, () => {
    console.log(`Doctor Tracker API running on port http://localhost:${port}`);
});
