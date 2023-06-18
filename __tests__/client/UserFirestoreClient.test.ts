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
} from "firebase/firestore";
import { Session } from "next-auth";

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

const mockHouseholdFirestoreClient = {
  getHousehold: jest.fn(),
  createHousehold: jest.fn(),
};

// HouseholdFirestoreClient;
jest.mock("../../src/client/HouseholdFirestoreClient", () => {
  return jest.fn().mockImplementation(() => {
    return mockHouseholdFirestoreClient;
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("FirestoreClient", () => {
  it("getUserByEmail returns user without household", async () => {
    const customerDocs = [
      {
        id: "abc123",
        name: "Homer Simpson",
        email: "homer.simpson@jershmail.com",
        image: "some.url",
      },
      {
        id: "abc456",
        name: "Lisa Simpson",
        email: "lisa.simpson@jershmail.com",
        image: "some.url",
      },
    ];

    mockGetDocs.mockResolvedValue({
      docs: [
        {
          id: customerDocs[0].id,
          data() {
            return customerDocs[0];
          },
        },
        {
          id: customerDocs[1].id,
          data() {
            return customerDocs[1];
          },
        },
      ],
    });

    const userFirestoreClient = new UserFirestoreClient();
    const user = await userFirestoreClient.getUserByEmail(
      "some.user@email.com"
    );

    expect(mockCollection).toHaveBeenCalled();
    expect(mockQuery).toHaveBeenCalled();
    expect(mockWhere).toHaveBeenCalledWith(
      "email",
      "==",
      "some.user@email.com"
    );
    expect(user.userId).toEqual(customerDocs[0].id);
    expect(user.email).toEqual(customerDocs[0].email);
    expect(user.name).toEqual(customerDocs[0].name);
    expect(user.image).toEqual(customerDocs[0].image);
    expect(user.household).toBeNull();
    expect(mockHouseholdFirestoreClient.getHousehold).not.toHaveBeenCalled();
  });

  it("getUserByEmail catches exception", async () => {
    mockGetDocs.mockRejectedValue({});

    const userFirestoreClient = new UserFirestoreClient();
    const user = await userFirestoreClient.getUserByEmail(
      "some.user@email.com"
    );

    expect(mockCollection).toHaveBeenCalled();
    expect(mockQuery).toHaveBeenCalled();
    expect(mockWhere).toHaveBeenCalledWith(
      "email",
      "==",
      "some.user@email.com"
    );

    expect(user).toBeNull();
    expect(mockHouseholdFirestoreClient.getHousehold).not.toHaveBeenCalled();
  });

  it("getUserByEmail returns user with household", async () => {
    const customerDocs = [
      {
        id: "abc123",
        name: "Homer Simpson",
        email: "homer.simpson@jershmail.com",
        image: "some.url",
        household: { id: "foo123" },
      },
      {
        id: "abc456",
        name: "Lisa Simpson",
        email: "lisa.simpson@jershmail.com",
        image: "some.url",
        household: { id: "bar456" },
      },
    ];

    mockGetDocs.mockResolvedValue({
      docs: [
        {
          id: customerDocs[0].id,
          data() {
            return customerDocs[0];
          },
        },
        {
          id: customerDocs[1].id,
          data() {
            return customerDocs[1];
          },
        },
      ],
    });

    const userFirestoreClient = new UserFirestoreClient();

    const household: Household = {
      householdId: "123abc",
      owner: null,
      members: [],
      name: "Test Household",
    };

    mockHouseholdFirestoreClient.getHousehold.mockResolvedValue(household);

    const user = await userFirestoreClient.getUserByEmail(
      "some.user@email.com"
    );

    expect(mockCollection).toHaveBeenCalled();
    expect(mockQuery).toHaveBeenCalled();
    expect(mockWhere).toHaveBeenCalledWith(
      "email",
      "==",
      "some.user@email.com"
    );
    expect(user.userId).toEqual(customerDocs[0].id);
    expect(user.email).toEqual(customerDocs[0].email);
    expect(user.name).toEqual(customerDocs[0].name);
    expect(user.image).toEqual(customerDocs[0].image);
    expect(user.household).not.toBeNull();
    expect(user.household).toEqual(household);
  });

  it("getUserByEmail does not find user", async () => {
    mockGetDocs.mockResolvedValue({
      empty: true,
    });

    const userFirestoreClient = new UserFirestoreClient();
    const user = await userFirestoreClient.getUserByEmail(
      "some.user@email.com"
    );

    expect(mockCollection).toHaveBeenCalled();
    expect(mockQuery).toHaveBeenCalled();
    expect(mockWhere).toHaveBeenCalledWith(
      "email",
      "==",
      "some.user@email.com"
    );
    expect(user).toBeNull();
  });

  it("createUser returns new user", async () => {
    const session: Session = {
      expires: null,
      user: {
        name: "Homer Simpson",
        email: "homer.simpson@jershmail.com",
        image: "some.url",
      },
    };

    const userDocRef = {
      id: "abc123",
    };

    mockAddDoc.mockResolvedValue(userDocRef);

    const userFirestoreClient = new UserFirestoreClient();
    const existingUser = jest
      .spyOn(userFirestoreClient, "getUserByEmail")
      .mockResolvedValue(null);

    const user = await userFirestoreClient.createUser(session);

    expect(mockAddDoc).toHaveBeenCalled();
    expect(user).not.toBeNull();
    expect(user.name).toEqual(session.user.name);
    expect(user.image).toEqual(session.user.image);
  });

  it("createUser returns existing user", async () => {
    const session: Session = {
      expires: null,
      user: {
        name: "Homer Simpson",
        email: "homer.simpson@jershmail.com",
        image: "some.url",
      },
    };

    const existingUserMock: User = {
      userId: "abc123",
      name: "Homer Simpson",
      email: "homer.simpson@jershmail.com",
      image: "some.url",
      household: null,
    };

    const userFirestoreClient = new UserFirestoreClient();

    jest
      .spyOn(userFirestoreClient, "getUserByEmail")
      .mockResolvedValue(existingUserMock);

    const user = await userFirestoreClient.createUser(session);

    expect(mockAddDoc).not.toHaveBeenCalled();
    expect(user).not.toBeNull();
    expect(user).toEqual(existingUserMock);
  });

  it("createUser catches exception", async () => {
    const session: Session = {
      expires: null,
      user: {
        name: "Homer Simpson",
        email: "homer.simpson@jershmail.com",
        image: "some.url",
      },
    };

    mockAddDoc.mockRejectedValue({});

    const userFirestoreClient = new UserFirestoreClient();

    jest.spyOn(userFirestoreClient, "getUserByEmail").mockResolvedValue(null);

    const user = await userFirestoreClient.createUser(session);

    expect(mockAddDoc).toHaveBeenCalled();
    expect(user).toBeNull();
  });
});
