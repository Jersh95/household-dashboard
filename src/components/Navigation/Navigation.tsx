import { Nav } from "react-bootstrap";
import styles from "../../styles/Navigation.module.scss";
import { signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";

type NavigationProps = {};

export const Navigation = ({}: NavigationProps): JSX.Element => {
  const { user } = useContext(AppContext);

  return (
    <Nav
      className="flex-column"
      variant="pills"
      justify
      defaultActiveKey={"home"}
    >
      <Nav.Item>
        <Nav.Link
          eventKey="home"
          id="home"
          href="/"
          className={styles.Navigation_link}
        >
          Dashboard
        </Nav.Link>
      </Nav.Item>
      {user ? (
        <Nav.Item>
          <Link
            id="signOut"
            href=""
            onClick={() => signOut()}
            className={styles.Navigation_link}
          >
            Sign Out
          </Link>
        </Nav.Item>
      ) : (
        <Nav.Item>
          <Link
            id="signIn"
            href=""
            onClick={() => signIn()}
            className={styles.Navigation_link}
          >
            Sign In
          </Link>
        </Nav.Item>
      )}
    </Nav>
  );
};
