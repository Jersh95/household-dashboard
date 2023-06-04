import UserFirestoreClient from "@/client/UserFirestoreClient";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { createContext, useEffect, useRef, useState } from "react";

type AppContextType = {
  initialized: boolean;
  user: User;
  setUser: (user: User) => Promise<void>;
};

export const AppContext = createContext<AppContextType>();

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const userFirestoreClient = new UserFirestoreClient();

  const { data: session } = useSession();

  const sessionSetRef = useRef(false);

  const [user, setUser] = useState<User | null>();
  const [initialized, setInitialized] = useState<boolean>(false);

  async function initialize(session: Session): Promise<void> {
    try {
      const existingUser = await userFirestoreClient.getUserByEmail(
        session.user.email
      );

      if (existingUser) {
        setUser(existingUser);
      } else {
        const createdUser = await userFirestoreClient.createUser(session);
        setUser(createdUser);
      }
    } catch (e) {
      console.error("Error initializing.", e);
      setUser(null);
    }

    setInitialized(true);
  }

  useEffect(() => {
    if (!sessionSetRef.current && session) {
      sessionSetRef.current = true;
      initialize(session);
    }
  }, [session]);

  const contextValue = {
    initialized,
    user,
    setUser,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
