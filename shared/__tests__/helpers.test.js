import moment from "moment";
import { createDate, getMonthDateRange } from "shared/helpers";

describe("Helper Functions", () => {
  it("returns a current date or specified date", () => {
    const format = "MMMM Do YYYY";
    const selectedDate = createDate("2019-10-08T03:30:15.000+00:00").format(
      format,
    );
    const todaysDate = moment(Date.now()).format(format);
    const currentDate = createDate().format(format);

    expect(selectedDate).toEqual("October 7th 2019");
    expect(currentDate).toEqual(todaysDate);
  });

  it("returns a current month range or specified month range", () => {
    const selectedDate = "2019-09-08T03:30:15.000+00:00";

    const {
      startOfMonth: selectedStartMonth,
      endOfMonth: selectedEndMonth,
    } = getMonthDateRange(selectedDate);

    expect(selectedStartMonth).toEqual(
      moment("2019-09-01T07:00:00.000Z").toDate(),
    );
    expect(selectedEndMonth).toEqual(
      moment("2019-10-01T06:59:59.999Z").toDate(),
    );

    const currentDate = Date.now();
    const {
      startOfMonth: currentStartMonth,
      endOfMonth: currentEndMonth,
    } = getMonthDateRange();

    expect(currentStartMonth).toEqual(
      moment(currentDate)
        .startOf("month")
        .toDate(),
    );
    expect(currentEndMonth).toEqual(
      moment(currentDate)
        .endOf("month")
        .toDate(),
    );
  });
});
