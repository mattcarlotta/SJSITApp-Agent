import chalk from "chalk";

export default forms =>
  `${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" INFO ")} ${chalk.blue(
    `Processed Forms... ${forms.length}`
  )}\n`;
