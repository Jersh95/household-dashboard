import { useSession } from "next-auth/react";
import { useContext, useRef } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { CreateHouseholdForm } from "./CreateHouseholdForm";
import { AppContext } from "@/context/AppContext";

type HouseholdProps = {};

export const Household = ({}: HouseholdProps): JSX.Element => {
  const { user } = useContext(AppContext);

  return (
    <Container>
      {user?.household ? (
        <h1>{user?.household?.name}</h1>
      ) : (
        <CreateHouseholdForm />
      )}
    </Container>
  );
};
