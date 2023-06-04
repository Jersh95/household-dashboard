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
      e.preventDefault();
      const form = e.currentTarget;
      setValidated(true);
      if (form.checkValidity()) {
        try {
          console.log(
            "creating with householdNameRef",
            householdNameRef.current
          );
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
      <Form onSubmit={onSubmit} noValidate validated={validated}>
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
        <Button type="submit">Submit</Button>
      </Form>
    );
  };
