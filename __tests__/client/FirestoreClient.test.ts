import FirestoreClient from "@/client/FirestoreClient";

const mockCollection = jest.fn().mockImplementation(() => { });
const mockWhere = jest.fn().mockImplementation(() => { });
const mockQuery = jest.fn().mockImplementation(() => { });
const mockGetDocs = jest.fn().mockImplementation(() => { });
jest.mock('firebase/firestore', () => {
    // return jest.fn().mockImplementation(() => {
    return {
        collection: () => { mockCollection },
        where: () => mockWhere,
        query: () => mockQuery,
        getDocs: () => {
            return {
                docs: [
                    {
                        data() {
                            return { id: 'abc123', name: 'Homer Simpson' }
                        }
                    },
                    {
                        data() {
                            return { id: 'abc456', name: 'Lisa Simpson' }
                        }
                    }
                ]

            }

        }
    }

    // })
});

jest.mock('../../firebase/clientApp', () => {
    return jest.fn().mockImplementation(() => {
        return {}
    })
})
describe('FirestoreClient', () => {

    it('getUser', async () => {
        // mockCollection.mockReturnValue(() => { console.log('checking'); return {} });
        // mockQuery.mockResolvedValue(() => { });
        // mockGetDocs.mockResolvedValue(() => { });
        // mockWhere.mockImplementation(() => { });
        // return db.collection('users').get().then(userDocs => {
        //     expect(mockCollection).toHaveBeenCalledWith('users');
        //     console.log('userDocs', userDocs)
        // })
        // mockGetDocs.mockReturnValue({
        //     docs: [
        //         {data() {
        //             return { id: 'abc123', name: 'Homer Simpson' }
        //         }},
        //         {data() {
        //             return { id: 'abc456', name: 'Lisa Simpson' }
        //         }}
        //       ]
        // })


        const client = new FirestoreClient();
        const user = await client.getUser('some.user@email.com');
        // expect(mockQuery).toHaveBeenCalled();
        console.log('user', user)
        // expect()

        // expect(mockCollection).toHaveBeenCalled();
        // expect(mockWhere).toHaveBeenCalledWith('email', '==', 'some.user@email.com');



        // const client = new FirestoreClient();
        // const user = await client.getUser("test@test.com");
    });
});