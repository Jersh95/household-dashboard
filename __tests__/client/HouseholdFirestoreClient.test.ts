import HouseholdFirestoreClient from "@/client/HouseholdFirestoreClient";
import UserFirestoreClient from "@/client/UserFirestoreClient";
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FieldPath,
  Firestore,
  Query,
  QueryConstraint,
  QueryFieldFilterConstraint,
  QuerySnapshot,
  UpdateData,
  WhereFilterOp,
  WithFieldValue,
  getDoc,
} from "firebase/firestore";

const mockCollection = jest.fn().mockImplementation(() => {});
const mockWhere = jest.fn().mockImplementation(() => {});
const mockQuery = jest.fn().mockImplementation(() => {});
const mockDoc = jest.fn().mockImplementation(() => {});
const mockGetDocs = jest.fn().mockImplementation(() => {});
const mockGetDoc = jest.fn().mockImplementation(() => {});
const mockAddDoc = jest.fn().mockImplementation(() => {});
const mockUpdateDoc = jest.fn().mockImplementation(() => {});

jest.mock("firebase/firestore", () => {
  return {
    collection: (
      firestore: Firestore,
      path: string
    ): CollectionReference<DocumentData> => mockCollection(firestore, path),
    where: (
      arg1: string | FieldPath,
      arg2: WhereFilterOp,
      arg3: unknown
    ): QueryFieldFilterConstraint => mockWhere(arg1, arg2, arg3),
    query: <T>(
      query: Query<T>,
      ...queryConstraints: QueryConstraint[]
    ): Query<T> => mockQuery(query, ...queryConstraints),
    doc: <T>(
      reference: CollectionReference<T>,
      path?: string,
      ...pathSegments: string[]
    ): DocumentReference<T> => mockDoc(reference, path, ...pathSegments),
    getDocs: async <T>(query: Query<T>): Promise<QuerySnapshot<T>> =>
      mockGetDocs(query),
    getDoc: async <T>(
      reference: DocumentReference<T>
    ): Promise<DocumentSnapshot<T>> => mockGetDoc(reference),
    addDoc: async <T>(
      reference: CollectionReference<T>,
      data: WithFieldValue<T>
    ): Promise<DocumentReference<T>> => mockAddDoc(reference, data),
    updateDoc: async <T>(
      reference: DocumentReference<T>,
      data: UpdateData<T>
    ): Promise<void> => mockUpdateDoc(reference, data),
  };
});

jest.mock("../../firebase/clientApp", () => {
  return jest.fn().mockImplementation(() => {
    return {};
  });
});

const mockUserFirestoreClient = {
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
};

HouseholdFirestoreClient;
jest.mock("../../src/client/UserFirestoreClient", () => {
  return jest.fn().mockImplementation(() => {
    return mockUserFirestoreClient;
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("HouseholdFirestoreClient", () => {
  it("getHousehold returns successfully", async () => {
    const household: Household = {
      householdId: "123abc",
      owner: null,
      members: [],
      name: "Test Household",
    };

    const user: User = {
      userId: "abc123",
      name: "Homer Simpson",
      email: "homer.simpson@jershmail.com",
      image: "some.url",
      household: household,
    };

    mockGetDoc.mockResolvedValue({
      id: household.householdId,
      data() {
        return household;
      },
      exists: () => true,
    });

    const householdFirestoreClient = new HouseholdFirestoreClient();

    const response = await householdFirestoreClient.getHousehold(user);

    expect(mockCollection).toHaveBeenCalled();
    expect(mockGetDoc).toHaveBeenCalled();
    expect(mockDoc).toHaveBeenCalled;
    expect(response).not.toBeNull();
  });

  it("getHousehold does not find household", async () => {
    const household: Household = {
      householdId: "123abc",
      owner: null,
      members: [],
      name: "Test Household",
    };

    const user: User = {
      userId: "abc123",
      name: "Homer Simpson",
      email: "homer.simpson@jershmail.com",
      image: "some.url",
      household: household,
    };

    mockGetDoc.mockResolvedValue({
      exists: () => false,
    });

    const householdFirestoreClient = new HouseholdFirestoreClient();

    const response = await householdFirestoreClient.getHousehold(user);

    expect(mockCollection).toHaveBeenCalled();
    expect(mockGetDoc).toHaveBeenCalled();
    expect(mockDoc).toHaveBeenCalled;
    expect(response).toBeNull();
  });

  it("getHousehold user does not have householdId", async () => {
    const user: User = {
      userId: "abc123",
      name: "Homer Simpson",
      email: "homer.simpson@jershmail.com",
      image: "some.url",
      household: null,
    };

    mockGetDoc.mockResolvedValue({
      exists: () => false,
    });

    const householdFirestoreClient = new HouseholdFirestoreClient();

    const response = await householdFirestoreClient.getHousehold(user);

    expect(mockCollection).toHaveBeenCalled();
    expect(mockGetDoc).not.toHaveBeenCalled();
    expect(mockDoc).not.toHaveBeenCalled;
    expect(response).toBeNull();
  });

  it("getHousehold catches exception", async () => {
    const household: Household = {
      householdId: "123abc",
      owner: null,
      members: [],
      name: "Test Household",
    };

    const user: User = {
      userId: "abc123",
      name: "Homer Simpson",
      email: "homer.simpson@jershmail.com",
      image: "some.url",
      household: household,
    };

    mockGetDoc.mockRejectedValue({});

    const householdFirestoreClient = new HouseholdFirestoreClient();

    const response = await householdFirestoreClient.getHousehold(user);

    expect(mockCollection).toHaveBeenCalled();
    expect(mockGetDoc).toHaveBeenCalled();
    expect(mockDoc).toHaveBeenCalled;
    expect(response).toBeNull();
  });

  it("createHousehold returns successfully", async () => {
    const household: Household = {
      householdId: "123abc",
      owner: null,
      members: [],
      name: "Test Household",
    };

    const user: User = {
      userId: "abc123",
      name: "Homer Simpson",
      email: "homer.simpson@jershmail.com",
      image: "some.url",
      household: null,
    };

    mockAddDoc.mockResolvedValue(household);
    mockUpdateDoc.mockResolvedValue(household);

    const householdFirestoreClient = new HouseholdFirestoreClient();

    const response = await householdFirestoreClient.createHousehold(
      user,
      "Test Household"
    );

    expect(mockCollection).toHaveBeenCalled();
    expect(mockAddDoc).toHaveBeenCalled();
    expect(mockUpdateDoc).toHaveBeenCalled();
    expect(response).not.toBeNull();
  });

  it("createHousehold catches error updating user", async () => {
    const household: Household = {
      householdId: "123abc",
      owner: null,
      members: [],
      name: "Test Household",
    };

    const user: User = {
      userId: "abc123",
      name: "Homer Simpson",
      email: "homer.simpson@jershmail.com",
      image: "some.url",
      household: null,
    };

    mockAddDoc.mockResolvedValue(household);
    mockUpdateDoc.mockRejectedValue({});

    const householdFirestoreClient = new HouseholdFirestoreClient();

    const response = await householdFirestoreClient.createHousehold(
      user,
      "Test Household"
    );

    expect(mockCollection).toHaveBeenCalled();
    expect(mockAddDoc).toHaveBeenCalled();
    expect(mockUpdateDoc).toHaveBeenCalled();
    expect(response).not.toBeNull();
  });

  it("createHousehold catches error updating user", async () => {
    const household: Household = {
      householdId: "123abc",
      owner: null,
      members: [],
      name: "Test Household",
    };

    const user: User = {
      userId: "abc123",
      name: "Homer Simpson",
      email: "homer.simpson@jershmail.com",
      image: "some.url",
      household: null,
    };

    mockAddDoc.mockResolvedValue(household);
    mockUpdateDoc.mockRejectedValue({});

    const householdFirestoreClient = new HouseholdFirestoreClient();

    const response = await householdFirestoreClient.createHousehold(
      user,
      "Test Household"
    );

    expect(mockCollection).toHaveBeenCalled();
    expect(mockAddDoc).toHaveBeenCalled();
    expect(mockUpdateDoc).toHaveBeenCalled();
    expect(response).not.toBeNull();
  });

  it("createHousehold catches error creating household", async () => {
    const household: Household = {
      householdId: "123abc",
      owner: null,
      members: [],
      name: "Test Household",
    };

    const user: User = {
      userId: "abc123",
      name: "Homer Simpson",
      email: "homer.simpson@jershmail.com",
      image: "some.url",
      household: null,
    };

    mockAddDoc.mockRejectedValue({});

    const householdFirestoreClient = new HouseholdFirestoreClient();

    const response = await householdFirestoreClient.createHousehold(
      user,
      "Test Household"
    );

    expect(mockCollection).toHaveBeenCalled();
    expect(mockAddDoc).toHaveBeenCalled();
    expect(mockUpdateDoc).not.toHaveBeenCalled();
    expect(response).toBeNull();
  });
});
