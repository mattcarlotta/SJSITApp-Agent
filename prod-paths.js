const tsconfigpaths = require("tsconfig-paths");

tsconfigpaths.register({
  baseUrl: "./build",
  paths: {
    "~database": ["database/index"],
    "~helpers": ["helpers/index"],
    "~libs/*": ["libs/*"],
    "~libs": ["libs/index"],
    "~loggers/*": ["loggers/*"],
    "~loggers": ["loggers/index"],
    "~middlewares": ["middlewares/index"],
    "~models/*": ["models/*"],
    "~models": ["models/index"],
    "~templates/*": ["templates/*"],
    "~templates": ["templates/index"],
    "~types": ["types/index"],
    "~utils/*": ["utils/*"]
  }
});
