import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  Image,
  Button,
  BackHandler,
} from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

function generateHTMLTable(attendanceData, selectedDate) {
  let tableRows = "";
  let grandTotalRegular = 0;
  let grandTotalPresent = 0;
  let grandTotalAbsent = 0;
  let grandDeptTotal = 0;

  const departmentColors = {
    AERO: "#FFD700", // Gold
    CIVIL: "#ADD8E6", // LightBlue
    CSE: "#FFB6C1", // LightPink
    ECE: "#98FB98", // PaleGreen
    EEE: "#FFDEAD", // NavajoWhite
    EIE: "#D8BFD8", // Thistle
    MECH: "#E0FFFF", // LightCyan
    IT: "#F0E68C", // Khaki
    TEX: "#FFC0CB", // Pink
    "I YEAR": "#87CEEB", // SkyBlue
    MBA: "#FFA07A", // LightSalmon
    MCA: "#B0E0E6", // PowderBlue
  };
  const departmentLabels = Object.keys(attendanceData);
  const departmentAttendancePercentages = departmentLabels.map((department) => {
    const deptTotalRegular = Object.values(attendanceData[department])?.reduce(
      (sum, records) =>
        sum + records.reduce((innerSum, record) => innerSum + record.total, 0),
      0
    );
    const deptTotalPresent = Object.values(attendanceData[department])?.reduce(
      (sum, records) =>
        sum +
        records.reduce((innerSum, record) => innerSum + record.present, 0),
      0
    );
    return ((deptTotalPresent / deptTotalRegular) * 100).toFixed(2);
  });

  Object.entries(attendanceData).forEach(([department, yearRecords]) => {
    let deptTotalRegular = 0;
    let deptTotalPresent = 0;
    let recordsProcessed = 0;
    let lowestAttendancePercentage = 100; // Initialize with 100 as the starting point
    let departmentWithLowestAttendance;
    let highestAbsentCount = 0; // Initialize with 0 as the starting point
    let departmentWithHighestAbsent;

    let deptTotalAbsent = 0;
    const deptAttendancePercentage =
      (deptTotalPresent / deptTotalRegular) * 100;
    if (deptAttendancePercentage < lowestAttendancePercentage) {
      lowestAttendancePercentage = deptAttendancePercentage;
      departmentWithLowestAttendance = department;
    }

    // Check for highest absent count for department
    if (deptTotalAbsent > highestAbsentCount) {
      highestAbsentCount = deptTotalAbsent;
      departmentWithHighestAbsent = department;
    }

    // Calculate department totals first
    Object.values(yearRecords).forEach((records) => {
      records.forEach((record) => {
        deptTotalRegular += record.total;
        deptTotalPresent += record.present;
        deptTotalAbsent += record.absent;
      });
    });
    function getOrdinal(yearValue) {
      const mapping = {
        year1: "1st",
        year2: "2nd",
        year3: "3rd",
        year4: "4th",
      };
      return mapping[yearValue] || "Invalid year value";
    }
    const totalRecords = Object.values(yearRecords).reduce(
      (sum, records) => sum + records.length,
      0
    );
    Object.entries(yearRecords)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([year, records]) => {
        records.forEach((record) => {
          const percentage = ((record.present / record.total) * 100).toFixed(2);
          const isBelowThreshold = parseFloat(percentage) < 75;
          const defaultColor = departmentColors[department] || "#FFFFFF";
          const colorStyle = isBelowThreshold
            ? 'style="background-color: #FF0000; color: white"'
            : `style="background-color: ${defaultColor};"`;

          tableRows += "<tr>";

          if (recordsProcessed === 0) {
            tableRows += `
          <td rowspan="${totalRecords}" style="background-color: ${defaultColor}">${department}</td>
          <td ${colorStyle}>${getOrdinal(year)}</td>
          <td ${colorStyle}>${record.total}</td>
          <td ${colorStyle}>${record.present}</td>
          <td ${colorStyle}>${record.absent}</td>
          <td ${colorStyle}>${percentage}%</td>
          <td rowspan="${totalRecords}" style="background-color: ${defaultColor}">${deptTotalRegular}</td>
          <td rowspan="${totalRecords}" style="background-color: ${defaultColor}">${deptTotalPresent}</td>
          <td rowspan="${totalRecords}" style="background-color: ${defaultColor}">${(
              (deptTotalPresent / deptTotalRegular) *
              100
            ).toFixed(2)}%</td>
          </tr>
          `;
          } else {
            tableRows += `
          <td ${colorStyle}>${getOrdinal(year)}</td>
          <td ${colorStyle}>${record.total}</td>
          <td ${colorStyle}>${record.present}</td>
          <td ${colorStyle}>${record.absent}</td>
          <td ${colorStyle}>${percentage}%</td>
          </tr>
          `;
          }
          recordsProcessed++;
        });
      });

    grandTotalRegular += deptTotalRegular;
    grandTotalPresent += deptTotalPresent;
    grandTotalAbsent += deptTotalAbsent;
    grandDeptTotal += deptTotalRegular;
  });

  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <script src="https://cdn.jsdelivr.net/npm/chart.js@3.5.1"></script>

      </head>
      <body style="text-align: center;">
      <div>
        <h3>Jaya Engineering College</h3>
        <h3>THIRUINRAVUR - 602024</h3>
        <h3>DAILY ATTANDANCE - REPORT</h3>
        <h3>DATE : ${selectedDate}</h3>
      </div>
        <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; margin-top: 20px;">
          <thead>
            <tr>
              <th>DEPT</th>
              <th>YEAR</th>
              <th>TOTAL</th>
              <th>PRESENT</th>
              <th>ABSENT</th>
              <th>ATT. PERCENTAGE</th>
              <th>DEPT. TOTAL</th>
              <th>TOTAL REG. STUD</th>
              <th>TOT. PRESENT DEPT. %</th>
            </tr>
          </thead>
          <tbody style="text-align:center;">
            ${tableRows}
            <tr>
              <td>Total</td>
              <td></td>
              <td>${grandTotalRegular}</td>
              <td>${grandTotalPresent}</td>
              <td>${grandTotalAbsent}</td>
              <td>${((grandTotalPresent / grandTotalRegular) * 100).toFixed(
                2
              )}%</td>
              <td>${grandDeptTotal}</td>
              <td>${grandTotalPresent}</td>
              <td>${((grandTotalPresent / grandDeptTotal) * 100).toFixed(
                2
              )}%</td>
            </tr>
          </tbody>
        </table>
        <canvas id="attendanceChart" width="400" height="200"></canvas>
        <script>
            document.addEventListener("DOMContentLoaded", function() {
                const departmentColors = ${JSON.stringify(departmentColors)};
                const departmentLabels = ${JSON.stringify(departmentLabels)};
                const departmentAttendancePercentages = ${JSON.stringify(
                  departmentAttendancePercentages
                )};

                const chartData = {
                    labels: departmentLabels,
                    datasets: [{
                        label: 'Attendance %',
                        data: departmentAttendancePercentages,
                        backgroundColor: departmentLabels.map(dept => departmentColors[dept] || '#FFFFFF'),
                        borderColor: departmentLabels.map(dept => departmentColors[dept] || '#FFFFFF'),
                        borderWidth: 1
                    }]
                };

                const ctx = document.getElementById('attendanceChart').getContext('2d');
                const ctx = canvas.getContext("2d");
                console.log("Canvas context:", ctx);
                const canvas = document.getElementById("attendanceChart");
                console.log("Canvas element:", canvas);
                new Chart(ctx, {
                    type: 'bar',
                    data: chartData,
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100
                            }
                        }
                    }
                });
            });
        </script>
      </body>
    </html>
  `;
}

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
function GetAttendance() {
  const backActionHandler = () => {
    router.replace("Dashboard");
    return true;
  };

  useEffect(() => {
    // Add event listener for hardware back button press on Android
    BackHandler.addEventListener("hardwareBackPress", backActionHandler);

    return () =>
      // clear/remove event listener
      BackHandler.removeEventListener("hardwareBackPress", backActionHandler);
  }, []);
  const [userdata, setUserdata] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  useEffect(() => {
    (async () => {
      const data = await retrieveData("UserData");
      setUserdata(data);
      setRole(data.role);
      setToken(data.token);
      console.log("token", data.token);
    })();
  }, []);
  useEffect(() => {
    console.log("userdata", userdata);
  }, [userdata]);
  const [selectedPrinter, setSelectedPrinter] = React.useState();

  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const date = new Date();

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false); // close date picker for Android
    setSelectedDate(currentDate.toISOString().split("T")[0]);
  };
  const print = async () => {
    const dynamicHTML = generateHTMLTable(
      groupedAttendanceByDepartment,
      selectedDate
    );
    await Print.printAsync({
      html: dynamicHTML,
      printerUrl: selectedPrinter?.url,
    });
  };

  const printToFile = async () => {
    const dynamicHTML = generateHTMLTable(
      groupedAttendanceByDepartment,
      selectedDate
    );
    const { uri } = await Print.printToFileAsync({ html: dynamicHTML });
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };
  console.log("selected", selectedDate);
  console.log("attendance", attendance);
  useEffect(() => {
    if (token) {
      fetch("https://ams-back.vercel.app/api/attendance?date=" + selectedDate, {
        headers: {
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setAttendance(data);
        })
        .catch((error) => console.error("Error fetching attendance:", error));
    }
  }, [selectedDate, token]);
  console.log("dep", attendance);
  const groupedAttendanceByDepartment = attendance?.reduce((acc, record) => {
    const { department, year } = record;
    if (!acc[department]) {
      acc[department] = {};
    }
    if (!acc[department][year]) {
      acc[department][year] = [];
    }
    acc[department][year].push(record);
    return acc;
  }, {});

  const aggregateDataByDepartment = Object.entries(
    groupedAttendanceByDepartment
  ).reduce((acc, [department, yearRecords]) => {
    acc[department] = { total: 0, present: 0, absent: 0 };
    Object.values(yearRecords).forEach((records) => {
      records.forEach((record) => {
        acc[department].total += record.total;
        acc[department].present += record.present;
        acc[department].absent += record.absent;
      });
    });
    return acc;
  }, {});
  function getOrdinal(yearValue) {
    const mapping = {
      year1: "1st",
      year2: "2nd",
      year3: "3rd",
      year4: "4th",
    };
    return mapping[yearValue] || "Invalid year value";
  }

  return (
    <ScrollView style={styles.container}>
      <View className="bg-white pt-2 flex flex-row text-left text-xl font-bold px-8  border-b">
        <Link className="pb-6" href="/Dashboard">
          <Image
            className="h-7 w-7 "
            source={{
              uri: "https://cdn.icon-icons.com/icons2/1709/PNG/512/back_112351.png",
            }}
          />
        </Link>
        <Text className="mt-2 text-2xl font-bold mx-8">View Attendance</Text>
      </View>
      <View>
        <View className="flex flex-row justify-center space-x-3 py-3 bg-[#009FF8]">
          <Image
            className="h-10 w-10"
            source={{
              uri: "https://blogger.googleusercontent.com/img/a/AVvXsEjmL38K-8tCjcNKGjvAGHeVHkyN8t1lo68bXI2oqe2WVp8RVuF9ombU-79T9guiG2Z4FRk18nhzTWz5-ZkPpy993uWl7D59MyfLyfz0I5d4fKH2XuKhSC0h9SqofVdxzM-lplb8s_pCCZk3sUyccrZEL3uWAkliNXGUWWX_uCg6txRFRASiN-24sUvaUT0",
            }}
          />
          <Text className="pt-1" style={styles.title}>
            JEC-AMS
          </Text>
        </View>
        <Text className="text-center text-blue-600 font-semibold text-lg my-2">
          You can view the Entire Department's Attendance here.
        </Text>

        <View className=" flex flex-row justify-center">
          <Button title="Choose Date" onPress={() => setShowDatePicker(true)} />
          <Text className="pt-1 text-lg"> : {selectedDate}</Text>
        </View>
        {role && role !== "hod" && role !== "faculty" && (
          <View>
            <Text className="text-center pt-3 text-lg font-bold">
              Download/Share the attendance report:
            </Text>
            <View className="flex flex-row gap-x-5  justify-center mx-3 py-4">
              <View>
                <Button title="Download Report" onPress={print} />
              </View>
              <View>
                <Button title="Share Report" onPress={printToFile} />
              </View>
            </View>
          </View>
        )}
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date(selectedDate)}
            mode="date"
            display="default"
            maximumDate={new Date(date)}
            onChange={handleDateChange}
          />
        )}
      </View>
      {attendance?.length === 0 ? (
        <Text className="text-center font-bold text-xl text-red-600 mt-5">
          No data available
        </Text>
      ) : (
        <View className="mx-4 my-4">
          {Object.entries(groupedAttendanceByDepartment).map(
            ([department, yearRecords]) => (
              <View
                key={department}
                className="rounded-xl mb-3 border-2 px-3 py-3 border-gray-200"
              >
                <Text style={styles.departmentTitle}>
                  Department: {department}
                </Text>
                {Object.entries(yearRecords)
                  .sort(
                    ([yearA], [yearB]) =>
                      parseInt(yearA.slice(-1)) - parseInt(yearB.slice(-1))
                  )
                  .map(([year, records]) => (
                    <View key={year}>
                      <Text style={styles.yearTitle}>
                        Year: {getOrdinal(year)}
                      </Text>
                      {records.map((record) => {
                        const percentage =
                          (record.present / record.total) * 100;
                        return (
                          <View
                            key={record._id}
                            className=" border rounded-2xl mb-3 border-blue-400 text-center py-4 px-4"
                          >
                            <View>
                              <Text className="text-md">
                                Section: {record.class}
                              </Text>
                            </View>
                            <View style={styles.recordHeader}>
                              <Text style={styles.recordHeaderText}>
                                Total Number of Students: {record.total}
                              </Text>
                              <Text
                                style={[
                                  styles.recordHeaderText,
                                  percentage < 50
                                    ? styles.redText
                                    : percentage < 75
                                    ? styles.orangeText
                                    : styles.greenText,
                                ]}
                              >
                                {percentage.toFixed(2)}%
                              </Text>
                            </View>
                            <View style={styles.recordSubHeader}>
                              <Text style={styles.recordSubHeaderText}>
                                No. OF PRESENT: {record.present}
                              </Text>
                              <Text style={styles.recordSubHeaderText}>
                                NO. OF ABSENT: {record.absent}
                              </Text>
                            </View>
                            <Text style={styles.absenteesText}>
                              Absentees Roll Numbers: {record.absentees}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  ))}
                <View style={styles.departmentSummary}>
                  <Text style={styles.departmentSummaryText}>
                    Total Number of Students in Department:{" "}
                    {aggregateDataByDepartment[department].total}
                  </Text>
                  <Text style={styles.departmentSummaryText}>
                    Total Present:{" "}
                    {aggregateDataByDepartment[department].present}
                  </Text>
                  <Text style={styles.departmentSummaryText}>
                    Total Absent: {aggregateDataByDepartment[department].absent}
                  </Text>
                  <Text
                    style={[
                      styles.departmentSummaryText,
                      (aggregateDataByDepartment[department].present /
                        aggregateDataByDepartment[department].total) *
                        100 <
                      50
                        ? styles.redText
                        : (aggregateDataByDepartment[department].present /
                            aggregateDataByDepartment[department].total) *
                            100 <
                          75
                        ? styles.orangeText
                        : styles.greenText,
                    ]}
                  >
                    Department Percentage:{" "}
                    {(
                      (aggregateDataByDepartment[department].present /
                        aggregateDataByDepartment[department].total) *
                      100
                    ).toFixed(2)}
                    %
                  </Text>
                </View>
              </View>
            )
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#009FF8",
  },
  headerImage: {
    height: 80,
    width: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginTop: 10,
  },
  dateInput: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 18,
  },
  content: {
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
  },
  departmentContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "lightgray",
    padding: 10,
  },
  departmentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  yearContainer: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  yearTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  record: {
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 10,
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  recordHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  recordSubHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  recordSubHeaderText: {
    fontSize: 14,
  },
  absenteesText: {
    fontSize: 14,
    marginTop: 5,
  },
  departmentSummary: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  departmentSummaryText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  redText: {
    color: "red",
  },
  orangeText: {
    color: "orange",
  },
  greenText: {
    color: "green",
  },
});

export default GetAttendance;
