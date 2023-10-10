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
    <View style={{ flex: 1 }} className="bg-[#009FF8] min-h-screen">
      <View className="bg-white pt-2 flex flex-row text-left text-xl font-bold px-8  border-b">
        <Text className="my-3 text-2xl font-bold mx-8">Home</Text>
      </View>
      <View className="relative isolate ">
        <View
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <View
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </View>
        <View className=" bg-white max-w-3xl pt-5">
          <View className=" flex bg-white  justify-center items-center flex-col  pt-5">
            <Image
              className=" h-28 w-28"
              source={{
                uri: "https://blogger.googleusercontent.com/img/a/AVvXsEjmL38K-8tCjcNKGjvAGHeVHkyN8t1lo68bXI2oqe2WVp8RVuF9ombU-79T9guiG2Z4FRk18nhzTWz5-ZkPpy993uWl7D59MyfLyfz0I5d4fKH2XuKhSC0h9SqofVdxzM-lplb8s_pCCZk3sUyccrZEL3uWAkliNXGUWWX_uCg6txRFRASiN-24sUvaUT0",
              }}
            />
            <Text className="text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              JEC - AMS
            </Text>
          </View>
          <View
            style={styles.example2}
            className="bg-[#009FF8]  mt-10 px-10 p-12"
          >
            <Text className="text-lg text-gray-100 pt-3 mt-1">
              A seamless platform for faculties to record and manage student
              attendance. With JEC-AMS, tracking daily attendance and generating
              reports becomes effortless. Whether you're a faculty member
              uploading daily records or a department head overseeing attendance
              metrics, our system is designed to provide a streamlined
              experience, ensuring accuracy and efficiency.
            </Text>

            <View className="fle flex-row mt-6  items-center justify-center gap-x-6">
              <TouchableOpacity
                className="rounded-2xl bg-[#4F14FF] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onPress={() => {
                  console.log("pressed");
                  router.replace("/Login");
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
