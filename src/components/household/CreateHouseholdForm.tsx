import HouseholdFirestoreClient from "@/client/HouseholdFirestoreClient";
import { AppContext } from "@/context/AppContext";
import { useContext, useState } from "react";
import { useRef } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";

type CreateHouseholdFormProps = {};

export const CreateHouseholdForm =
  ({}: CreateHouseholdFormProps): JSX.Element => {
    const householdFirestoreClient = new HouseholdFirestoreClient();

    const [validated, setValidated] = useState(false);

    const householdNameRef = useRef();

    const { user } = useContext(AppContext);

    const onSubmit = async (e: React.FormEvent) => {
      console.log("clicked submit");
      e.preventDefault();
      const form = e.currentTarget;
      // console.log("form", form);
      // console.log("target", e.currentTarget);
      // console.log("checking", form.checkValidity());
      setValidated(true);
      // console.log(
      //   "householdNameRef.current.value",
      //   householdNameRef.current.value
      // );
      if (form.checkValidity()) {
        try {
          console.log("trying");
          const household = await householdFirestoreClient.createHousehold(
            user,
            householdNameRef.current.value
          );
        } catch (e) {
          console.error("Error creating household.", e);
        }
      }
    };

    return (
      <Form
        id="createHouseholdForm"
        onSubmit={onSubmit}
        noValidate
        validated={validated}
      >
        <Form.Group>
          <FloatingLabel
            controlId="householdName"
            label="Household Name"
            className="mb-3"
          >
            <Form.Control
              ref={householdNameRef}
              required
              type="text"
              placeholder="Household Name"
            />
            <Form.Control.Feedback type="invalid">
              Enter a name for the household.
            </Form.Control.Feedback>
          </FloatingLabel>
        </Form.Group>
        <Button type="submit" id="createHouseholdButton">
          Submit
        </Button>
      </Form>
    );
  };
