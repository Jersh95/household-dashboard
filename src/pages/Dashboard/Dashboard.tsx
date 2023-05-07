import { Button } from "react-bootstrap";
import styles from "../../styles/Dashboard.module.scss";
import FirestoreClient from "@/client/FirestoreClient";
import { useSession } from "next-auth/react";
import { useContext, useRef } from "react";
import { Household } from "@/components/household/Household";
import { AppContext } from "@/context/AppContext";

type DashboardProps = {};

export const Dashboard = ({}: DashboardProps): JSX.Element => {
  const { user } = useContext(AppContext);

  return (
    <div className={styles.Dashboard}>
      <Household />
    </div>
  );
};
