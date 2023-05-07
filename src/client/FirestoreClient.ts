import { firestore } from "@/../firebase/clientApp";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { Session } from "next-auth";

export default class FirestoreClient {
  constructor() {}

  usersRef = collection(firestore, "users");
  householdsRef = collection(firestore, "households");

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
            const household = await this.getHousehold(user);
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

  async getHousehold(user: User): Promise<Household | null> {
    if (user?.household?.householdId) {
      const household = await getDoc(
        doc(this.householdsRef, user.household?.householdId)
      )
        .then((documentSnapshot) => {
          if (documentSnapshot.exists()) {
            const householdDoc = documentSnapshot;
            const household: Household = {
              householdId: householdDoc.id,
              owner: householdDoc.data().owner?.id,
              members: [user],
              // members: householdDoc.data().members (do a foreach to check?)
              name: householdDoc.data().name,
            };

            return household;
          } else {
            return null;
          }
        })
        .catch((e) => {
          console.error("Error retrieving household.", e);
          return null;
        });

      return household;
    } else {
      return null;
    }
  }

  async createHousehold(user: User, name: string): Promise<Household | null> {
    const household = await addDoc(this.householdsRef, {
      name: name,
      owner: doc(this.usersRef, user.userId),
    })
      .then(async (response) => {
        await updateDoc(doc(this.usersRef, user.userId), {
          household: doc(this.householdsRef, response.id),
        })
          .then(() => {
            const household: Household = {
              householdId: response.id,
              name: name,
              owner: user,
              members: [user],
            };

            return household;
          })
          .catch((e) => {
            console.error("Error updating ");
          });
      })
      .catch((e) => {
        console.error("Error creating household.", e);
        return null;
      });

    return household;
  }
}
