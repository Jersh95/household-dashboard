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

export default class HouseholdFirestoreClient {
  constructor() {}

  usersRef = collection(firestore, "users");
  householdsRef = collection(firestore, "households");

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
