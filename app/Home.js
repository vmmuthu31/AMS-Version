import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Link, router } from "expo-router";
import { AiOutlineArrowLeft } from "react-icons/ai";

const Home = () => {
  return (
    <View style={{ flex: 1 }} className="bg-[#009FF8] min-h-screen pb-10">
      <View className="bg-white pt-2 flex-row text-left text-xl font-bold px-8 border-b">
        <Text className="my-3 text-2xl font-bold mx-8">Home</Text>
      </View>
      <View className="flex-1 relative isolate">
        <View className="bg-white max-w-3xl   flex-1">
          <View className=" flex bg-white my-16 justify-center items-center flex-col ">
            <Image
              className="h-16 w-1/6"
              source={{
                uri: "https://blogger.googleusercontent.com/img/a/AVvXsEjmL38K-8tCjcNKGjvAGHeVHkyN8t1lo68bXI2oqe2WVp8RVuF9ombU-79T9guiG2Z4FRk18nhzTWz5-ZkPpy993uWl7D59MyfLyfz0I5d4fKH2XuKhSC0h9SqofVdxzM-lplb8s_pCCZk3sUyccrZEL3uWAkliNXGUWWX_uCg6txRFRASiN-24sUvaUT0",
              }}
            />
            <Text className="text-[8vw] font-bold tracking-tight text-gray-900 sm:text-[7vw]">
              JEC - AMS
            </Text>
          </View>
          <View style={styles.example2} className="flex-1 bg-[#009FF8]   p-12">
            <Text className="text-[4.5vw]   py-5 font-semibold text-justify   text-gray-100 ">
              A seamless platform for faculties to record and manage student
              attendance. With JEC-AMS, tracking daily attendance and generating
              reports becomes effortless. Whether you're a faculty member
              uploading daily records or a department head overseeing attendance
              metrics, our system is designed to provide a streamlined
              experience, ensuring accuracy and efficiency.
            </Text>

            <View className="flex-row  items-center mt-4 justify-center gap-x-6">
              <TouchableOpacity
                className="rounded-2xl bg-[#4F14FF] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onPress={() => {
                  console.log("pressed");
                  router.replace("Login");
                }}
              >
                <Text className="text-white font-bold text-lg">Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded-2xl bg-[#DC2626] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                onPress={() => router.replace("Register")}
              >
                <Text className="text-white font-bold text-lg">Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  example2: {
    borderWidth: 0,
    borderTopLeftRadius: 120,
  },
});

export default Home;
