import { BackHandler } from "react-native";
import React from "react";

function ProfileScreen({ onBackPress }) {
  React.useEffect(() => {
    // Add the event listener when the component mounts
    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    // Remove the event listener when the component unmounts
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, [onBackPress]);

  // You need to return something from your component
  return <div>{/* Your ProfileScreen content here */}</div>;
}

export default ProfileScreen;
