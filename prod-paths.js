const tsconfigpaths = require("tsconfig-paths");

tsconfigpaths.register({
  baseUrl: "./build",
  paths: {
    "~database": ["database/index"],
    "~helpers": ["helpers/index"],
    "~lib": ["lib/index"],
    "~loggers": ["loggers/index"],
    "~models/*": ["models/*"],
    "~models": ["models/index"],
    "~services/*": ["services/*"],
    "~services": ["services/index"],
    "~templates/*": ["templates/*"],
    "~templates": ["templates/index"],
    "~types": ["types/index"],
    "~utils/*": ["utils/*"]
  }
});
