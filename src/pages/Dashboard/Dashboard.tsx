import styles from "../../styles/Dashboard.module.scss";
import { useContext } from "react";
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
