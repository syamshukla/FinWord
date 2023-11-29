/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function page() {
  const [ticker, setTicker] = useState("");
  const tickers = [];
  const [stockDataList, setStockDataList] = useState<any[]>([]);
  const saveReset = async () => {
    const data = getStockData(ticker);
    console.log(data);
  };
  function handleKeyPress(
    e: React.KeyboardEvent<HTMLInputElement>,
    ticker: string,
  ) {
    var key = e.key;
    console.log("You pressed a key: " + key);
    if (key == "Enter") {
      setTicker(e.currentTarget.value.toUpperCase());
      tickers.push(e.currentTarget.value.toUpperCase());
      saveReset();
    }
  }
  const getStockData = async (symbol: any) => {
    if (stockDataList.length >= 5) {
      console.log("Max number of stocks reached");https://github.com/rreichel3/US-Stock-Symbols
      return;
    }

    const apiKey = "X5dRPphf5sGhzIdHr9ElQLHQ_oBg8RIF"; // Replace with your actual API key
    const currentDate = new Date();

    // Exclude the present day
    currentDate.setDate(currentDate.getDate() - 1);

    // Ensure we go back to the last market open day (considering weekends)
    while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const day = String(currentDate.getDate()).padStart(2, "0");

    const date = `${year}-${month}-${day}`;
    try {
      const response = await fetch(
        `https://api.polygon.io/v1/open-close/${symbol}/${date}?adjusted=true&apiKey=${apiKey}`,
      );
      const data = await response.json();
      const { high, low, open, close } = data;
      setStockDataList([...stockDataList, data]);
      console.log(data);
      return data;
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex w-full max-w-sm flex-col items-center gap-1.5">
        <Label htmlFor="email">
          Enter Stock Ticker ({stockDataList.length}/5)
        </Label>
        <Input
          type="text"
          id="ticker"
          placeholder="AAPL"
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
        />
        <Button onClick={saveReset}>Enter</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticker</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockDataList.map((stockData, index) => (
            <TableRow key={index}>
              <TableCell>{stockData.symbol}</TableCell>
              <TableCell>{stockData.close}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
