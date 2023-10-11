import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  ToastAndroid,
  ScrollView,
  BackHandler,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const retrieveData = async (key) => {
  try {
    const itemStr = await AsyncStorage.getItem(key);
    if (itemStr) {
      const item = JSON.parse(itemStr);
      const oneMonth = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - item.timestamp > oneMonth) {
        await AsyncStorage.removeItem(key);
        return null;
      }
      return item.value;
    }
    return null;
  } catch (error) {}
};

function AddAttendance() {
  const backActionHandler = () => {
    router.replace("Dashboard");
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backActionHandler);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backActionHandler);
  }, []);
  const [userdata, setUserdata] = useState(null);
  const [department, setDepartment] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await retrieveData("UserData");
      setUserdata(data);
      setDepartment(data.department);
      setToken(data.token);
    })();
  }, []);
  useEffect(() => {
    console.log("userdata", userdata);
    console.log("dep", userdata?.department);
  }, [userdata]);

  const currentDate = new Date().toISOString().split("T")[0];
  const [selectedYear, setSelectedYear] = useState("year1");
  console.log("year", selectedYear);
  const [fetchdata, setFetchData] = useState();

  const showToast = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };

  const handleInputChange = (name, value) => {
    setFormData1((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [selectedClass, setSelectedClass] = useState("A");
  const getTotalForClass = (selectedYear, selectedClass) => {
    if (
      fetchdata &&
      fetchdata[selectedYear] &&
      fetchdata[selectedYear].class === selectedClass
    ) {
      return fetchdata[selectedYear].total;
    }
    return 0;
  };
  console.log(getTotalForClass(selectedYear, selectedClass));
  useEffect(() => {
    if (department) {
      // Only make the fetch if department is defined
      async function fetchData() {
        const response = await fetch(
          `https://ams-back.vercel.app/api/view-total-students?department=${department}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("res", data);
          setFetchData(data);
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      }
      fetchData();
    }
  }, [department]);

  useEffect(() => {
    setFormData1((prevFormData) => ({
      ...prevFormData,
      total: getTotalForClass(selectedYear, selectedClass),
      absent:
        getTotalForClass(selectedYear, selectedClass) -
        (prevFormData.present ? parseInt(prevFormData.present) : 0),
    }));
  }, [selectedYear, selectedClass, fetchdata]);

  const initialFormData = {
    date: currentDate,
    class: selectedClass,
    total: getTotalForClass(selectedYear, selectedClass),
    department: department,
    present: "",
    year: selectedYear,
    absentees: "",
    absent: "",
  };

  const [formData1, setFormData1] = useState(initialFormData);
  formData1.absent =
    getTotalForClass(selectedYear, selectedClass) - formData1.present;

  const handleSubmit = async () => {
    console.log("vm", getTotalForClass(selectedYear, selectedClass).toString());
    console.log(formData1);
    console.log("secl");
    const response = await fetch("https://ams-back.vercel.app/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(formData1),
    });
    if (response.ok) {
      showToast("Uploaded the attendance!");
      setFormData1(initialFormData);
    } else {
      console.error(" failed");
      showToast("Failed to upload the attendance!");
    }
  };
  return (
    <ScrollView style={{ flex: 1 }}>
      <View className="bg-white pt-2 flex flex-row text-left text-xl font-bold px-8  border-b">
        <Link className="pb-6" href="/Dashboard">
          <Image
            className="h-7 w-7 "
            source={{
              uri: "https://cdn.icon-icons.com/icons2/1709/PNG/512/back_112351.png",
            }}
          />
        </Link>
        <Text className="mt-2 text-2xl font-bold mx-8">Put Attendance</Text>
      </View>
      <View>
        <View className="flex flex-row justify-center space-x-3 py-3 bg-[#009FF8]">
          <Image
            className="h-10 w-10"
            source={{
              uri: "https://blogger.googleusercontent.com/img/a/AVvXsEjmL38K-8tCjcNKGjvAGHeVHkyN8t1lo68bXI2oqe2WVp8RVuF9ombU-79T9guiG2Z4FRk18nhzTWz5-ZkPpy993uWl7D59MyfLyfz0I5d4fKH2XuKhSC0h9SqofVdxzM-lplb8s_pCCZk3sUyccrZEL3uWAkliNXGUWWX_uCg6txRFRASiN-24sUvaUT0",
            }}
          />
          <Text className="pt-1 text-white font-bold text-xl">JEC-AMS</Text>
        </View>
        <Text className="text-center text-blue-600 font-semibold text-lg my-2">
          Please select the Year and update your department attendance for
          today.
        </Text>
        <View className="mx-6 mt-5">
          <View>
            <Text>Select Year:</Text>
            <View className="border my-2 rounded-sm">
              <Picker
                selectedValue={selectedYear}
                onValueChange={(itemValue) => {
                  setSelectedYear(itemValue);
                  handleInputChange("year", itemValue);
                  if (itemValue === "year1") {
                    setDepartment("year1");
                  }
                }}
              >
                <Picker.Item label="Year 1" value="year1" />
                <Picker.Item label="Year 2" value="year2" />
                <Picker.Item label="Year 3" value="year3" />
                <Picker.Item label="Year 4" value="year4" />
              </Picker>
            </View>
            <Text>Select Class Section:</Text>
            <View className="border my-2 rounded-sm">
              <Picker
                selectedValue={selectedClass}
                onValueChange={(itemValue) => {
                  setSelectedClass(itemValue);
                  handleInputChange("class", itemValue);
                }}
              >
                <Picker.Item label="A" value="A" />
                <Picker.Item label="B" value="B" />
              </Picker>
            </View>
            <View>
              <Text className="">
                Total Students: {getTotalForClass(selectedYear, selectedClass)}
              </Text>
            </View>
          </View>
          <Text className="mt-2">Students Present</Text>
          <TextInput
            value={formData1.present}
            onChangeText={(value) => handleInputChange("present", value)}
            style={styles.input}
            placeholder="  Students Present"
          />
          <Text>Absentees Number</Text>
          <TextInput
            value={formData1.absentees}
            onChangeText={(value) => handleInputChange("absentees", value)}
            style={styles.input}
            placeholder="Absentees Number"
          />
          <Text className="my-1">
            Absentee Count:
            {formData1.total -
              (formData1.present ? parseInt(formData1.present) : 0)}
          </Text>

          <Button
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            title="Upload"
            onPress={handleSubmit}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontSize: 16,
    marginBottom: 16,
  },
  pickerContainer: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    borderRadius: 4,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
  },
});

export default AddAttendance;
