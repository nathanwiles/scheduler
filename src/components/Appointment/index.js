import React from "react";

import "components/Appointment/styles.scss";
import Header from "./Header";
import Empty from "./Empty";
import Show from "./Show";
import Form from "./Form";
import Confirm from "./Confirm";
import Error from "./Error";
import Status from "./Status";

import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const EDIT = "EDIT";
const SAVING = "SAVING";
const DELETING = "DELETING";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";
const CONFIRM = "CONFIRM"

const LOADING = "LOADING";


export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
  
    transition(SAVING);
  
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  }
  
  function destroy() {
    transition(DELETING, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  }



  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />

      {/* DISPLAY ELEMENTS */}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}

      {/* MODIFICATION ELEMENTS */}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        ></Form>
      )}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer.id}
          onSave={save}
          onCancel={back}
        ></Form>
      )}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you would like to delete?"
          onCancel={back}
          onConfirm={destroy}
        ></Confirm>
      )}
      {/* STATUS MESSAGES */}
      {mode === LOADING && <Status message="Loading" />}

      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}

      {mode === ERROR_DELETE && <Error message="Error on Delete" onClose={back} />}
      {mode === ERROR_SAVE && <Error message="Error on Save" onClose={back} />}
    </article>
  );
}
