const app = require('./src/app');
const errorHandler = require("./src/middleware/errorHandler");
require('dotenv').config();

const PORT = process.env.PORT || 3000;


app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
