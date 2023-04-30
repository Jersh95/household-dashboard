import {firestore} from '@/../firebase/clientApp';
import { collection, query, where, getDocs, QueryDocumentSnapshot, DocumentData, setDoc, doc } from 'firebase/firestore';

export default class FirestoreClient {
    constructor() { };

    usersRef = collection(firestore, 'users');

    async getUser(email: string): Promise<User | null> {
        console.log('ok lets try')
        try {
            console.log('query', query)
            console.log('getDocs', getDocs)
            const result: QueryDocumentSnapshot<DocumentData>[] = [];
            const q = query(this.usersRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                return null;
            } else {
                console.log('querySnapshot', querySnapshot)
                console.log('docs', querySnapshot.docs)
                const user:User = {...querySnapshot.docs[0].data()};
                return user;
            }
        } catch(e) {
            console.error('Error getting user', e);
            return null;
        }
    }

    async createUser(user: User): Promise<User | undefined> {
        console.log('in the create user?')
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