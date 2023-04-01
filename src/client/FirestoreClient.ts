import { firestore } from '../../firebase/clientApp';
import { collection, query, where, getDocs, QueryDocumentSnapshot, DocumentData, setDoc, doc } from 'firebase/firestore';

export default class FirestoreClient {
    constructor() { };

    usersRef = collection(firestore, 'users');

    async getUser(email: string): Promise<User | null> {
        try {
            const result: QueryDocumentSnapshot<DocumentData>[] = [];
            const q = query(this.usersRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                return null;
            } else {
                const user:User = {...querySnapshot.docs[0].data()};
                return user;
            }
        } catch(e) {
            console.error('Error getting user', e);
            return null;
        }
        
    }

    async createUser(user: User): Promise<User | undefined> {
        const existingUser = await this.getUser(user.email);
        if (!existingUser) {
            try {
                await setDoc(doc(this.usersRef), user);
                return user;
                
            } catch (e) {
                console.error('Error creating user', e)
                return null;
            }
        }
    }
}