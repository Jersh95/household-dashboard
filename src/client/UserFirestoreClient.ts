import { firestore } from "@/../firebase/clientApp";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Session } from "next-auth";
import HouseholdFirestoreClient from "./HouseholdFirestoreClient";

export default class UserFirestoreClient {
  constructor() {}

  usersRef = collection(firestore, "users");
  householdFirestoreClient = new HouseholdFirestoreClient();

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await getDocs(
      query(this.usersRef, where("email", "==", email))
    )
      .then(async (querySnapshot) => {
        if (querySnapshot.empty) {
          return null;
        } else {
          const userDoc = querySnapshot.docs[0];
          const user: User = {
            userId: userDoc.id,
            email: userDoc.data().email,
            name: userDoc.data().name,
            image: userDoc.data().image,
            household: userDoc.data().household?.id
              ? <Household>{
                  householdId: userDoc.data().household?.id,
                }
              : null,
          };

          if (userDoc.data().household?.id) {
            const household = await this.householdFirestoreClient.getHousehold(
              user
            );
            if (household) {
              user.household = household;
            }
          }

          return user;
        }
      })
      .catch((e) => {
        console.error("Error getting user.", e);
        return null;
      });

    return user;
  }

  async createUser(session: Session): Promise<User | null> {
    const existingUser = await this.getUserByEmail(session.user.email);
    if (!existingUser) {
      const createdUser = await addDoc(this.usersRef, session.user)
        .then((documentRef) => {
          return {
            userId: documentRef.id,
            ...session.user,
          };
        })
        .catch((e) => {
          console.error("Error creating user", e);
          return null;
        });

      return createdUser;
    } else {
      return existingUser;
    }
  }
}
