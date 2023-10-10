import { Provider } from "react-redux";
import { store } from "../slice/store";
import Home from "./Home";

export default function Page() {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
}

// ... styles remain unchanged
