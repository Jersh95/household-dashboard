const docData = { data: "MOCK_DATA" };
const docResult = {
  // simulate firestore get doc.data() function
  data: () => docData
};
const get = jest.fn(() => Promise.resolve(docResult));
const set = jest.fn();
const collection = jest.fn();
const doc = jest.fn(() => {
  return {
    collection,
    set,
    get
  };
});
const mockFirestore = () => {
  return { doc };
};
mockFirestore.FieldValue = {
  serverTimestamp: () => {
    return "MOCK_TIME";
  }
};

export { mockFirestore };