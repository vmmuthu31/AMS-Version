import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { login } from "../slice/authSlice";
import { ToastAndroid } from "react-native";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Store data with expiry
const storeData = async (key, value) => {
  try {
    // Store value along with current timestamp
    const item = {
      value: value,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    // Handle storage errors
  }
};

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const response = await fetch("https://ams-back.vercel.app/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      const vm = {
        token: data.token,
        role: data.role,
        email: data.email,
        department: data.department,
      };
      console.log("vm", vm);
      storeData("UserData", vm);
      ToastAndroid.show("Login Successful!", ToastAndroid.SHORT);
      router.replace("Dashboard");
    } else {
      console.error("Login failed");
      ToastAndroid.show("Login Failed!", ToastAndroid.SHORT);
    }
  };

  return (
    <View>
      <View className="bg-white pt-2 flex flex-row text-left text-xl font-bold px-8  border-b">
        <Link className="pb-6" href="/Home">
          <Image
            className="h-7 w-7 "
            source={{
              uri: "https://cdn.icon-icons.com/icons2/1709/PNG/512/back_112351.png",
            }}
          />
        </Link>
        <Text className="mt-2 text-2xl font-bold mx-8">Login</Text>
      </View>
      <View className="flex flex-row justify-center space-x-3 py-3 bg-[#009FF8]">
        <Image
          className="h-10 w-10"
          source={{
            uri: "https://blogger.googleusercontent.com/img/a/AVvXsEjmL38K-8tCjcNKGjvAGHeVHkyN8t1lo68bXI2oqe2WVp8RVuF9ombU-79T9guiG2Z4FRk18nhzTWz5-ZkPpy993uWl7D59MyfLyfz0I5d4fKH2XuKhSC0h9SqofVdxzM-lplb8s_pCCZk3sUyccrZEL3uWAkliNXGUWWX_uCg6txRFRASiN-24sUvaUT0",
          }}
        />
        <Text className="pt-1 text-white font-bold text-xl">JEC-AMS</Text>
      </View>
      <View className=" flex mx-10 my-28 bg-white justify-center align-middle">
        <View className="">
          <Text className="text-xl font-bold text-center mb-10">
            Login here!
          </Text>
          <TextInput
            className=" border rounded-md p-4 mb-10"
            placeholder="Email address"
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
          />
          <TextInput
            className=" border rounded-md p-4 mb-10"
            placeholder="Password"
            value={formData.password}
            onChangeText={(value) => handleInputChange("password", value)}
            secureTextEntry
          />
          <Button title="Login" onPress={handleSubmit} />
          <TouchableOpacity onPress={() => router.replace("Register")}>
            <Text style={styles.registerText}>
              Don’t have an account? Sign up!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  loginContainer: {
    width: "80%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  registerText: {
    color: "blue",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Login;
