import moment from "moment";
import { errorMessage, infoMessage } from "~loggers";
import { Form, Season } from "~models";
import { getEndOfMonth, getStartOfNextMonth } from "~helpers";

/**
 * Creates an AP Form for next months schedule.
 *
 * @function CreateAPForm
 */
const CreateAPForm = async (): Promise<void> => {
  try {
    // start of next month
    const startMonth = getStartOfNextMonth();

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

    // testing current month dates
    // const sendEmailNotificationsDate = moment().format();
    // const expirationDate = moment()
    //   .startOf("month")
    //   .add(6, "days")
    //   .endOf("day")
    //   .format();

    // set A/P form expiration date 7 days from the 1st
    const expirationDate = moment()
      .add(1, "month")
      .startOf("month")
      .add(6, "days")
      .endOf("day")
      .format();

    // create an A/P form
    await Form.create({
      seasonId: existingSeason.seasonId,
      startMonth: startMonth.format(),
      endMonth: endMonth.format(),
      expirationDate,
      sendEmailNotificationsDate: startMonth.format(),
      notes: ""
    });

    infoMessage("Processed AP Forms... 1");
  } catch (err: any) {
    /* istanbul ignore next */
    errorMessage(err.toString());
  }
};

export default CreateAPForm;
