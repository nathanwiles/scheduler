import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";

import Form from "components/Appointment/Form";

afterEach(cleanup);

describe("Form", () => {
  const interviewers = [
    {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png",
    },
  ];

  it("renders without student name if not provided", () => {
    const { getByPlaceholderText } = render(
      <Form interviewers={interviewers} />
    );
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });

  it("renders with initial student name", () => {
    const { getByTestId } = render(
      <Form interviewers={interviewers} student="Lydia Miller-Jones" />
    );
    expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones");
  });

  it("validates that the student name is not blank", () => {
    /* 1. Create the mock onSave function */
    const onSave = jest.fn();

    /* 2. Render the Form with interviewers and the onSave mock function passed as an onSave prop, the student prop should be blank or undefined */
    const { getByText } = render(
      <Form interviewers={interviewers} onSave={onSave} />
    );
    /* 3. Click the save button */
    fireEvent.click(getByText(/save/i));

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("validates that the interviewer cannot be null", () => {
    /* 1. Create the mock onSave function */
    const onSave = jest.fn();
    /* 2. Render the Form with interviewers and the onSave mock function passed as an onSave prop, the interviewer prop should be null */
    const { getByText } = render(
      <Form
        interviewers={interviewers}
        onSave={onSave}
        student="Lydia Miller-Jones"
      />
    );
    /* 3. Click the save button */
    fireEvent.click(getByText(/save/i));

    expect(getByText(/please select an interviewer/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("can successfully save after trying to submit an empty student name", () => {
    const onSave = jest.fn();
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form interviewers={interviewers} onSave={onSave} interviewer={1} />
    );
    const saveButton = getByText(/save/i);
    const input = getByPlaceholderText("Enter Student Name");

    fireEvent.click(saveButton);

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: "Lydia Miller-Jones" } });

    fireEvent.click(saveButton);

    expect(queryByText(/student name cannot be blank/i)).toBeNull();

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1);
  });
  it("calls onCancel and resets the input field", () => {
    const onCancel = jest.fn();
    const onSave = jest.fn();

    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form
        interviewers={interviewers}
        onCancel={onCancel}
        student="Lydia Mill-Jones"
        onSave={onSave}
      />
    );

    const saveButton = getByText(/save/i);
    const cancelButton = getByText(/cancel/i);
    const input = getByPlaceholderText("Enter Student Name");

    fireEvent.click(saveButton);

    fireEvent.change(input, { target: { value: "Lydia Miller-Jones" } });

    fireEvent.click(cancelButton);

    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    
    expect(input).toHaveValue("");

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
