import { errorMessage, infoMessage } from "~loggers";
import { Form, Season } from "~models";
import { createDate, getEndOfMonth, getStartOfNextNextMonth } from "~helpers";

/**
 * Creates an AP Form for next months schedule.
 *
 * @function CreateAPForm
 */
const CreateAPForm = async (): Promise<void> => {
  try {
    // start of next month
    const startMonth = getStartOfNextNextMonth();

    // testing current month
    // const startMonth = moment().startOf("month");

    // end of next month
    const endMonth = getEndOfMonth(startMonth.toDate());

    // locate season that encapulates next month
    const existingSeason = await Season.findOne(
      {
        startDate: { $lte: startMonth.toDate() },
        endDate: { $gte: startMonth.toDate() }
      },
      { seasonId: 1 }
    );
    /* istanbul ignore next */
    if (!existingSeason)
      throw String("Unable to locate a seasonId associated with that month.");

    const { seasonId } = existingSeason;

    // testing current month dates
    // const sendEmailNotificationsDate = moment().format();
    // const expirationDate = moment()
    //   .startOf("month")
    //   .add(6, "days")
    //   .endOf("day")
    //   .format();

    // set A/P form expiration date 7 days from the 1st
    const expirationDate = createDate()
      .add(1, "month")
      .startOf("month")
      .add(6, "days")
      .endOf("day")
      .format();

    // send A/P Form emails on the 1st of each month
    const sendEmailNotificationsDate = createDate()
      .add(1, "month")
      .startOf("month")
      .format();

    // create an A/P form
    await Form.create({
      seasonId,
      startMonth: startMonth.format(),
      endMonth: endMonth.format(),
      expirationDate,
      sendEmailNotificationsDate,
      notes: ""
    });

    infoMessage("Processed Forms... 1");
  } catch (err) {
    errorMessage(err.toString());
  }
};

export default CreateAPForm;
