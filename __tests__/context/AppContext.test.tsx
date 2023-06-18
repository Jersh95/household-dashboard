import { AppContext, AppContextProvider } from "@/context/AppContext";
import { waitFor } from "@testing-library/react";
import { mount } from "enzyme";

const mockSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: { email: "homer.simpson@jershmail.com" },
};

jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual("next-auth/react");

  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => {
      return { data: mockSession, status: "authenticated" };
    }),
  };
});

const mockUserFirestoreClient = {
  getUserByEmail: jest.fn().mockImplementation(() => {}),
  createUser: jest.fn().mockImplementation(() => {}),
};
jest.mock("../../src/client/UserFirestoreClient", () => {
  return jest.fn().mockImplementation(() => {
    return mockUserFirestoreClient;
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("AppContext", () => {
  it("initializes and finds existing user", async () => {
    const user: User = {
      userId: "abc123",
      name: "Homer Simpson",
      email: "homer.simpson@jershmail.com",
      image: "some.url",
      household: null,
    };

    mockUserFirestoreClient.getUserByEmail.mockResolvedValue(user);

    mount(
      <AppContextProvider>
        <AppContext.Consumer>{(appContext) => <div></div>}</AppContext.Consumer>
      </AppContextProvider>
    );

    await waitFor(async () => {
      expect(mockUserFirestoreClient.getUserByEmail).toHaveBeenCalledWith(
        mockSession.user.email
      );
      expect(mockUserFirestoreClient.createUser).not.toHaveBeenCalled();
    });
  });

  it("initializes and creates user", async () => {
    const user: User = {
      userId: "abc123",
      name: "Homer Simpson",
      email: "homer.simpson@jershmail.com",
      image: "some.url",
      household: null,
    };

    mockUserFirestoreClient.getUserByEmail.mockResolvedValue(null);
    mockUserFirestoreClient.createUser.mockResolvedValue(user);

    mount(
      <AppContextProvider>
        <AppContext.Consumer>{(appContext) => <div></div>}</AppContext.Consumer>
      </AppContextProvider>
    );

    await waitFor(async () => {
      expect(mockUserFirestoreClient.getUserByEmail).toHaveBeenCalledWith(
        mockSession.user.email
      );
      expect(mockUserFirestoreClient.createUser).toHaveBeenCalledWith(
        mockSession
      );
    });
  });

  it("catches initialization exception", async () => {
    const user: User = {
      userId: "abc123",
      name: "Homer Simpson",
      email: "homer.simpson@jershmail.com",
      image: "some.url",
      household: null,
    };

    mockUserFirestoreClient.getUserByEmail.mockRejectedValue({});

    mount(
      <AppContextProvider>
        <AppContext.Consumer>{(appContext) => <div></div>}</AppContext.Consumer>
      </AppContextProvider>
    );

    await waitFor(async () => {
      expect(mockUserFirestoreClient.getUserByEmail).toHaveBeenCalledWith(
        mockSession.user.email
      );
      expect(mockUserFirestoreClient.createUser).not.toHaveBeenCalled();
    });
  });
});
