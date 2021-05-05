const tsconfigpaths = require("tsconfig-paths");

tsconfigpaths.register({
  baseUrl: "./build",
  paths: {
    "~database": ["database/index"],
    "~helpers": ["helpers/index"],
    "~services/*": ["services/*"],
    "~services": ["services/index"],
    "~loggers": ["loggers/index"],
    "~models/*": ["models/*"],
    "~models": ["models/index"],
    "~templates/*": ["templates/*"],
    "~templates": ["templates/index"],
    "~types": ["types/index"],
    "~utils/*": ["utils/*"]
  }
});
