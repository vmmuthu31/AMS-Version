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

function UpdateStudentData() {
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
  const [department, setDepartment] = useState("AERO");
  const [token, setToken] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await retrieveData("UserData");
      setUserdata(data);
      console.log("user data dep", data.department);
      setToken(data.token);
    })();
  }, []);
  useEffect(() => {
    console.log("userdata", userdata);
  }, [userdata]);

  const currentDate = new Date().toISOString().split("T")[0];
  const [selectedYear, setSelectedYear] = useState("year2");
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
      fetchdata[selectedYear]?.classes
    ) {
      const classesInYear = fetchdata[selectedYear]?.classes;
      const classObject = classesInYear.find(
        (classObj) => classObj.className === selectedClass
      );

      if (classObject) {
        return classObject.total;
      }
    }
    return 0;
  };
  const getRegularForClass = (selectedYear, selectedClass) => {
    if (
      fetchdata &&
      fetchdata[selectedYear] &&
      fetchdata[selectedYear]?.classes
    ) {
      const classesInYear = fetchdata[selectedYear]?.classes;
      const classObject = classesInYear.find(
        (classObj) => classObj.className === selectedClass
      );

      if (classObject) {
        return classObject.regular;
      }
    }
    return 0;
  };

  console.log("total", getTotalForClass(selectedYear, selectedClass));
  console.log("regular", getRegularForClass(selectedYear, selectedClass));
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    if (department) {
      if (department === "I YEAR") {
        setSelectedYear("year1");
      }
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
  }, [department, refreshData]);

  const [updatetotal, setUpdatetotal] = useState();
  const [updateRegular, setUpdateRegular] = useState();

  useEffect(() => {
    const newFormData = {
      department: department,
      [selectedYear]: {
        classes: [
          {
            className: selectedClass,
            total: updatetotal,
            regular: updateRegular,
          },
        ],
      },
    };

    setFormData1(newFormData);
  }, [selectedClass, selectedYear, department, updatetotal, updateRegular]);

  console.log("selectedyear", selectedYear);
  console.log("selectedClass", selectedClass);
  const initialFormData = {
    department: department,
    [selectedYear]: {
      classes: [
        {
          className: "",
          total: "",
          regular: "",
        },
      ],
    },
  };

  console.log("updateRegular changed:", updateRegular);
  const [formData1, setFormData1] = useState(initialFormData);
  const handleSubmit = async () => {
    console.log("deparment", department);
    console.log("formdata1", formData1[selectedYear]);
    console.log("total", formData1[selectedYear]?.classes[0].total);
    try {
      const response = await fetch(
        `https://ams-back.vercel.app/api/update-total-students/${department}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(formData1),
        }
      );

      if (response.ok) {
        showToast("Updated the attendance Data!");
        setFormData1(initialFormData);
        setUpdatetotal(""); // Resetting to empty string
        setUpdateRegular(""); // Resetting to empty string
        setRefreshData((prev) => !prev); // Toggle the refreshData state
      } else {
        const errorData = await response.json();
        console.error("Failed to update:", errorData);
        showToast("Failed to upload the attendance!");
      }
    } catch (error) {
      console.error("Network request failed:", error);
      showToast("Network request failed. Please try again.");
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
        <Text className="mt-2 text-2xl font-bold mx-8">
          Update Student Count
        </Text>
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
          <Text>Select Department:</Text>
          <View className="border my-2 rounded-sm">
            <Picker
              selectedValue={department}
              onValueChange={(itemValue) => {
                setDepartment(itemValue);
                console.log("department", itemValue);
                handleInputChange("department", itemValue);
              }}
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
          <View>
            {department === "MCA" || department === "MBA" ? (
              <>
                <Text>Select Year:</Text>
                <View className="border my-2 rounded-sm">
                  <Picker
                    selectedValue={selectedYear}
                    onValueChange={(itemValue) => {
                      setSelectedYear(itemValue);
                      handleInputChange("year", itemValue);
                    }}
                  >
                    <Picker.Item label="Year 1" value="year1" />
                    <Picker.Item label="Year 2" value="year2" />
                  </Picker>
                </View>
              </>
            ) : (
              <></>
            )}
            {department === "I YEAR" ||
            department === "MCA" ||
            department === "MBA" ? (
              <></>
            ) : (
              <>
                <Text>Select Year:</Text>
                <View className="border my-2 rounded-sm">
                  <Picker
                    selectedValue={selectedYear}
                    onValueChange={(itemValue) => {
                      setSelectedYear(itemValue);
                      handleInputChange("year", itemValue);
                    }}
                  >
                    <Picker.Item label="Year 2" value="year2" />
                    <Picker.Item label="Year 3" value="year3" />
                    <Picker.Item label="Year 4" value="year4" />
                  </Picker>
                </View>
              </>
            )}

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
                {fetchdata &&
                  fetchdata[selectedYear]?.classes[1]?.className === "B" && (
                    <Picker.Item label="B" value="B" />
                  )}
                {fetchdata &&
                  fetchdata[selectedYear]?.classes[2]?.className === "C" && (
                    <Picker.Item label="C" value="C" />
                  )}
                {fetchdata &&
                  fetchdata[selectedYear]?.classes[3]?.className === "D" && (
                    <Picker.Item label="D" value="D" />
                  )}
                {fetchdata &&
                  fetchdata[selectedYear]?.classes[4]?.className === "E" && (
                    <Picker.Item label="E" value="E" />
                  )}
              </Picker>
            </View>
          </View>
          <Text className="mt-2">
            Total Students Count:
            {getTotalForClass(selectedYear, selectedClass)}
          </Text>
          <TextInput
            value={updatetotal}
            onChangeText={(text) => {
              if (text.trim() !== "") {
                const numberValue = parseInt(text, 10);
                if (!isNaN(numberValue)) {
                  setUpdatetotal(numberValue);
                } else {
                  console.warn("Entered value is not a valid number");
                }
              } else {
                setUpdatetotal(0); // or set to a default value or null
              }
            }}
            style={styles.input}
            placeholder="Total Count to Update"
          />
          <Text>
            Total Regular Students:
            {getRegularForClass(selectedYear, selectedClass)}
          </Text>
          <TextInput
            value={updateRegular}
            onChangeText={(text) => {
              if (text.trim() !== "") {
                const numberValue = parseInt(text, 10);
                if (!isNaN(numberValue)) {
                  setUpdateRegular(numberValue);
                } else {
                  console.warn("Entered value is not a valid number");
                }
              } else {
                setUpdateRegular(0); // or set to a default value or null
              }
            }}
            style={styles.input}
            placeholder="Total Regular to Update"
          />
          <Button
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            title="Update"
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

export default UpdateStudentData;
