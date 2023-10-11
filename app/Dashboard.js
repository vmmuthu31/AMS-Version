import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Retrieve data and check for expiry
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

async function removeItemValue(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (exception) {
    return false;
  }
}

function Dashboard() {
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
  const role = userdata ? userdata.role : null;
  const handleLogout = async () => {
    await removeItemValue("UserData");
    router.replace("/");
  };

  console.log(role);
  return (
    <View style={styles.container}>
      <View className="bg-white pt-2 flex flex-row text-left justify-between text-xl font-bold px-8  border-b">
        <Text className="mt-2 text-2xl font-bold mx-4">Dashboard</Text>
        <TouchableOpacity className="pb-6" onPress={handleLogout}>
          <Image
            className="h-7 w-7 bg-white "
            source={{
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk8rXmrbwkvOlRL-sbIRH2WiY5rkThzKMx9g&usqp=CAU",
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://blogger.googleusercontent.com/img/a/AVvXsEjmL38K-8tCjcNKGjvAGHeVHkyN8t1lo68bXI2oqe2WVp8RVuF9ombU-79T9guiG2Z4FRk18nhzTWz5-ZkPpy993uWl7D59MyfLyfz0I5d4fKH2XuKhSC0h9SqofVdxzM-lplb8s_pCCZk3sUyccrZEL3uWAkliNXGUWWX_uCg6txRFRASiN-24sUvaUT0",
          }}
          style={styles.logo}
        />
        <Text style={styles.title}>JEC - AMS</Text>
        <View className="bg-white rounded-xl py-5 px-8 mt-10">
          <Text className="text-center text-xl font-bold text-gray-700">
            Welcome {userdata?.email.slice(0, -10)}
          </Text>
          <Text className="text-center  text-xl font-bold text-gray-700">
            Faculty of {userdata?.department}
          </Text>
        </View>
      </View>
      <View className="mt-20 mx-10">
        <TouchableOpacity
          className="flex flex-row justify-center bg-[#4F14FF] rounded-lg mx-5  py-3 text-white"
          onPress={() => {
            router.replace("/GetAttendance");
          }}
        >
          <Text className="text-white font-bold ">View Attendance</Text>
        </TouchableOpacity>
        {role !== "superadmin" && (
          <>
            <Text className="text-center py-3 text-xl font-bold">Or</Text>
            <TouchableOpacity
              className="flex flex-row justify-center bg-[#4F14FF] rounded-lg mx-5  py-3 text-white"
              onPress={() => {
                router.replace("/AddAttendance");
              }}
            >
              <Text className="text-white font-bold ">Add Attendance</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#009FF8",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#009FF8",
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  welcomeContainer: {
    backgroundColor: "white",
    padding: 20,
    marginTop: 20,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  departmentText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  orText: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },
});

export default Dashboard;
