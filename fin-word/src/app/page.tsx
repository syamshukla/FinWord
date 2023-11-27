"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const getStockData = async (symbol: any) => {
  const response = await fetch(
    `https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${uyJZfjE33Dd1QXpRxp20ie5tZHdLx3lH}`
  );
  const data = await response.json();
  return data;
};

import React from "react";

export default function page() {
  return (
    <>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">Stock Ticker</Label>
        <Input type="stock" id="ticker" placeholder="AAPL" />
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
          <TableRow>
            <TableCell className="font-medium">1</TableCell>
            <TableCell>1</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
