import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { useDispatch } from "react-redux";
import { login } from "../slice/authSlice";
import { Link, router } from "expo-router";

function Login() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleInputChange = (name, value) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const performLogin = async (data) => {
    try {
      const response = await fetch("https://ams-back.vercel.app/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return response;
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  const handleSubmit = async () => {
    const response = await performLogin(formData);

    if (response && response.ok) {
      const data = await response.json();
      dispatch(login(data));
      ToastAndroid.show("Login Successful!", ToastAndroid.SHORT);
      router.replace("Dashboard");
    } else {
      console.error("Login failed");
      ToastAndroid.show("Login Failed!", ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href="/Home" className="pb-6">
          <Image
            style={styles.backIcon}
            source={{
              uri: "https://cdn.icon-icons.com/icons2/1709/PNG/512/back_112351.png",
            }}
          />
        </Link>
        <Text style={styles.headerText}>Login</Text>
      </View>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={{
            uri: "https://blogger.googleusercontent.com/img/a/AVvXsEjmL38K-8tCjcNKGjvAGHeVHkyN8t1lo68bXI2oqe2WVp8RVuF9ombU-79T9guiG2Z4FRk18nhzTWz5-ZkPpy993uWl7D59MyfLyfz0I5d4fKH2XuKhSC0h9SqofVdxzM-lplb8s_pCCZk3sUyccrZEL3uWAkliNXGUWWX_uCg6txRFRASiN-24sUvaUT0",
          }}
        />
        <Text style={styles.logoText}>JEC-AMS</Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Login here!</Text>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={email}
          onChangeText={(value) => handleInputChange("email", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    paddingBottom: 2,
    borderBottomWidth: 1,
    marginLeft: 20,
    borderColor: "gray",
  },
  backIcon: {
    height: 28,
    width: 28,
    padding: 10,
    marginTop: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#009FF8",
    padding: 16,
  },
  logo: {
    height: 40,
    width: 40,
    marginRight: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  formTitle: {
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
