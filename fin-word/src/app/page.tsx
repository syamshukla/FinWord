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
  const tickers: never[] = [];

  const saveReset = async () => {
    const data = getStockData(ticker);
    console.log(data);
  };
  function handleKeyPress(
    e: React.KeyboardEvent<HTMLInputElement>,
    ticker: string
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
    const apiKey = "uyJZfjE33Dd1QXpRxp20ie5tZHdLx3lH"; // Replace with your actual API key

    try {
      const response = await fetch(
        `https://api.polygon.io/v3/reference/tickers/${symbol}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            // You can include other headers if required, for example:
            // 'Content-Type': 'application/json'
          },
          mode: "cors", // Include this line to enable CORS
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">Stock Ticker</Label>
        <input
          type="text"
          id="ticker"
          placeholder="AAPL"
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
        />
        <button onClick={saveReset}>Enter</button>
      </div>
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>Ticker</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium"></TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">1</TableCell>
            <TableCell>1</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">1</TableCell>
            <TableCell>1</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">1</TableCell>
            <TableCell>1</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">1</TableCell>
            <TableCell>1</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
function getStockData(ticker: string) {
  throw new Error("Function not implemented.");
}
