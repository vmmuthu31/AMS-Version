import { Provider } from "react-redux";
import { store } from "../slice/store";
import Home from "./Home";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Dashboard from "./Dashboard";
import { useEffect, useState } from "react";

const retrieveData = async (key) => {
  try {
    const itemStr = await AsyncStorage.getItem(key);
    if (itemStr) {
      const item = JSON.parse(itemStr);

      // Check if data is older than 1 month (30 days)
      const oneMonth = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
      if (Date.now() - item.timestamp > oneMonth) {
        // Data is expired, remove it
        await AsyncStorage.removeItem(key);
        return null;
      }
      return item.value;
    }
    return null;
  } catch (error) {
    // Handle retrieval errors
  }
};

export default function Page() {
  const [userdata, setUserdata] = useState(null);
  useEffect(() => {
    (async () => {
      const data = await retrieveData("UserData");
      setUserdata(data);
    })();
  }, []);
  useEffect(() => {
    console.log("userdata", userdata);
  }, [userdata]);
  return (
    <Provider store={store}>
      {userdata ? <Dashboard /> : <Home />}
      <Home />
    </Provider>
  );
}

// ... styles remain unchanged
