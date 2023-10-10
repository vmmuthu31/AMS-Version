import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Link, router } from "expo-router";
function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    department: "B.E AERONAUTICAL ENGINEERING",
    role: "faculty",
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("https://ams-back.vercel.app/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Signup Successful!");
        router.replace("Login");
      } else {
        console.error("Sign-in failed");
        alert("Signup Failed!");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
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

      <View className="my-20" style={styles.container}>
        <Text className="text-center font-bold text-2xl pt-3 pb-10">
          Signup here!
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={formData.email}
          onChangeText={(value) => handleInputChange("email", value)}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.department}
            onValueChange={(value) => handleInputChange("department", value)}
          >
            <Picker.Item label="AERO" value="AERO">
              AERO
            </Picker.Item>
            <Picker.Item label="CIVIL" value="CIVIL">
              CIVIL
            </Picker.Item>
            <Picker.Item label="CSE" value="CSE">
              CSE
            </Picker.Item>
            <Picker.Item label="ECE" value="ECE">
              ECE
            </Picker.Item>
            <Picker.Item label="EEE" value="EEE">
              EEE
            </Picker.Item>
            <Picker.Item label="EIE" value="EIE">
              EIE
            </Picker.Item>
            <Picker.Item label="MECH" value="MECH">
              MECH
            </Picker.Item>
            <Picker.Item label="IT" value="IT">
              IT
            </Picker.Item>
            <Picker.Item label="TEX" value="TEX">
              TEX
            </Picker.Item>
            <Picker.Item label="I YEAR" value="I YEAR">
              I YEAR
            </Picker.Item>
            <Picker.Item label="MBA" value="MBA">
              MBA
            </Picker.Item>
            <Picker.Item label="MCA" value="MCA">
              MCA
            </Picker.Item>
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.role}
            onValueChange={(value) => handleInputChange("role", value)}
          >
            <Picker.Item label="Faculty" value="faculty" />
            <Picker.Item label="HOD" value="hod" />
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={formData.password}
          onChangeText={(value) => handleInputChange("password", value)}
        />

        <Button title="Sign up" onPress={handleSubmit} />

        <Text style={styles.link} onPress={() => router.replace("Login")}>
          Existing User?
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginBottom: 15,
  },
  pickerContainer: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    borderRadius: 4, // Optional for rounded corners
  },
  link: {
    color: "blue",
    marginTop: 15,
    textAlign: "right",
  },
});

export default Register;
