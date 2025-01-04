"use client";

import React, { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";

const API_URL =
  "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService";
const API_KEY =
  "B3K3XdGgYEbagcSNZ66GNStWZyarYnXf11%2Fo0mpBfKfPghTyTVTD3x4W7EPwyB4umqAvop%2FGooMP1OWX7d0e4g%3D%3D";

Font.register({
  family: "NotoSansKR",
  src: "https://fonts.gstatic.com/ea/notosanskr/v2/NotoSansKR-Regular.woff2",
});

const styles = StyleSheet.create({
  body: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    fontFamily: "NotoSansKR",
  },
  year: {
    fontSize: 16,
    color: "#666666",
  },
  title: {
    fontSize: 36,
    marginBottom: 20,
    color: "#333333",
  },
  calendar: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
  },
  cell: {
    width: 76,
    height: 90,
    margin: 2,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#ffffff",
    borderRadius: 5,
    padding: 5,
  },
  dayCell: {
    height: 40,

    color: "#333333",
    fontWeight: "bold",
  },
  day: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  date: {
    fontSize: 14,
    color: "#555555",
  },
  weekend: {
    backgroundColor: "#f0f8ff",
    color: "#A4A4A4",
  },
  holiday: {
    color: "gray",
    fontWeight: "bold",
  },
  holidayText: {
    fontSize: 10,
    color: "#d32f2f",
    marginTop: 2,
  },
});

// API 호출 함수
const fetchHolidays = async (year: number) => {
  const url = `${API_URL}/getRestDeInfo?serviceKey=${API_KEY}&solYear=${year}&numOfRows=100&_type=json`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.response.body.items.item) {
    return data.response.body.items.item.map((item: any) => ({
      date: item.locdate.toString(),
      name: item.dateName,
    }));
  }
  return [];
};

// 달력 생성 함수
const generateCalendar = (year: number, month: number, holidays: any[]) => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const rows: string[][] = [];
  let currentRow: string[] = new Array(7).fill("");
  let currentDay = 1;

  for (let i = 0; i < firstDay; i++) {
    currentRow[i] = "";
  }

  for (let i = firstDay; i < 7; i++) {
    currentRow[i] = currentDay.toString();
    currentDay++;
  }

  rows.push(currentRow);

  while (currentDay <= daysInMonth) {
    currentRow = new Array(7).fill("");
    for (let i = 0; i < 7 && currentDay <= daysInMonth; i++) {
      currentRow[i] = currentDay.toString();
      currentDay++;
    }
    rows.push(currentRow);
  }

  return { days, rows };
};

const Calendar2025 = ({ holidays }: { holidays: any[] }) => (
  <Document>
    {[...Array(12)].map((_, index) => {
      const { days, rows } = generateCalendar(2025, index, holidays);
      return (
        <Page style={styles.body} key={index}>
          {/* 모든 페이지 상단에 2025년 표시 */}
          <Text style={styles.year}>2025년</Text>
          <Text style={styles.title}>{index + 1}월</Text>
          <View style={styles.calendar}>
            <View style={styles.row}>
              {days.map((day) => (
                <Text style={[styles.cell, styles.dayCell]} key={day}>
                  {day}
                </Text>
              ))}
            </View>
            {rows.map((row, rowIndex) => (
              <View style={styles.row} key={rowIndex}>
                {row.map((date, dateIndex) => {
                  const fullDate = `2025${String(index + 1).padStart(
                    2,
                    "0"
                  )}${String(date).padStart(2, "0")}`;
                  const isHoliday = holidays.find(
                    (holiday) => holiday.date === fullDate
                  );

                  return (
                    <View
                      key={dateIndex}
                      style={[
                        styles.cell,
                        dateIndex === 0 || dateIndex === 6
                          ? styles.weekend
                          : undefined,
                        isHoliday && styles.holiday,
                      ]}
                    >
                      <Text style={styles.date}>{date}</Text>
                      {isHoliday && (
                        <Text style={styles.holidayText}>{isHoliday.name}</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </Page>
      );
    })}
  </Document>
);

const Viewer = () => {
  const [holidays, setHolidays] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchAndSetHolidays = async () => {
      const fetchedHolidays = await fetchHolidays(2025);
      setHolidays(fetchedHolidays);
    };

    fetchAndSetHolidays();
  }, []);

  return (
    <PDFViewer style={{ width: "70%", height: "70vh" }}>
      <Calendar2025 holidays={holidays} />
    </PDFViewer>
  );
};

export default Viewer;
