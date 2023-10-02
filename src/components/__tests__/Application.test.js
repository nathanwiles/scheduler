import React from "react";
import { render, waitForElement } from "@testing-library/react";
import { fireEvent } from "@testing-library/react/dist";

import Application from "components/Application";

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });
});
