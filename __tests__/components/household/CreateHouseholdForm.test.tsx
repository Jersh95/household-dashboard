import { CreateHouseholdForm } from "@/components/household/CreateHouseholdForm";
import { AppContext } from "@/context/AppContext";
import { waitFor } from "@testing-library/react";
import { mount, shallow } from "enzyme";
import { Simulate, act } from "react-dom/test-utils";

const mockHouseholdFirestoreClient = {
  getHousehold: jest.fn().mockImplementation(() => {}),
  createHousehold: jest.fn().mockImplementation(() => {}),
};

jest.mock("../../../src/client/HouseholdFirestoreClient", () => {
  return jest.fn().mockImplementation(() => {
    return mockHouseholdFirestoreClient;
  });
});

describe("CreateHouseholdForm", () => {
  it("renders successfully", () => {
    const user: User = {
      userId: "abc123",
      name: "Homer Simpson",
      email: "homer.simpson@jershmail.com",
      image: "some.url",
      household: null,
    };

    const component = mount(
      <AppContext.Provider value={{ user: user }}>
        <CreateHouseholdForm />
      </AppContext.Provider>
    );
    expect(component).toMatchSnapshot();
  });

  // TODO: fix test
  // it("renders and submits", async () => {
  //   const user: User = {
  //     userId: "abc123",
  //     name: "Homer Simpson",
  //     email: "homer.simpson@jershmail.com",
  //     image: "some.url",
  //     household: null,
  //   };

  //   // mockHouseholdFirestoreClient.createHousehold.mockResolvedValue{{}};

  //   const component = mount(
  //     <AppContext.Provider value={{ user: user }}>
  //       <CreateHouseholdForm />
  //     </AppContext.Provider>
  //   );

  //   // console.log("component", component.debug());

  //   let input = component.find("#householdName").first();
  //   expect(input).toBeDefined();
  //   const form = component.find("#createHouseholdForm").first();
  //   expect(form).toBeDefined();

  //   act(() => {
  //     // input.simulate("change", { target: { value: "Test Name" } });
  //     input.simulate("change", {
  //       target: { name: "householdName", value: "Test Name" },
  //     });
  //   });

  //   // await act(async () => {
  //   //   await form.simulate("submit");
  //   // });

  //   await waitFor(async () => {
  //     expect(component.find("#householdName").first().value).toEqual(
  //       "Test Name"
  //     );
  //     // expect(input.value).toEqual("Test Name");
  //     // expect(mockHouseholdFirestoreClient.createHousehold).toHaveBeenCalled();
  //   });
  // });
});
