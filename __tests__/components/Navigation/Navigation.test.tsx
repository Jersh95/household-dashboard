import { Navigation } from "@/components/Navigation/Navigation";
import { AppContext } from "@/context/AppContext";
import { shallow, mount } from "enzyme";
import { useSession, signIn, signOut } from "next-auth/react";
import { Simulate, act } from "react-dom/test-utils";

jest.mock("next-auth/react");
const mockUseSession = useSession as jest.Mock;
(signIn as jest.Mock).mockImplementation(() => jest.fn());
(signOut as jest.Mock).mockImplementation(() => jest.fn());

describe("Navigation", () => {
  it("renders logged in and clicks log out", async () => {
    const mockSession = {
      data: {
        user: {
          id: "some-ID",
          name: "Test User",
          email: "test-user@test.com",
          image: "some-url",
        },
      },
    };

    const user: User = {
      userId: "abc123",
      name: "Homer Simpson",
      email: "homer.simpson@jershmail.com",
      image: "some.url",
      household: null,
    };

    const component = mount(
      <AppContext.Provider value={{ user: user }}>
        <Navigation />
      </AppContext.Provider>
    );

    expect(component.exists("#signOut")).toBe(true);
    expect(component.exists("#signIn")).toBe(false);

    const button = component.find("#signOut").first();
    act(() => {
      button.simulate("click");
    });
    expect(signOut).toHaveBeenCalled();
  });

  it("renders logged out and clicks log in", async () => {
    const component = mount(
      <AppContext.Provider value={{ user: null }}>
        <Navigation />
      </AppContext.Provider>
    );

    expect(component.exists("#signOut")).toBe(false);
    expect(component.exists("#signIn")).toBe(true);

    const button = component.find("#signIn").first();
    act(() => {
      button.simulate("click");
    });
    expect(signIn).toHaveBeenCalled();
  });
});
