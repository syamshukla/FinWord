/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/lib/firebase/index';

const app = initializeApp(firebaseConfig);
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function page() {
  const [ticker, setTicker] = useState('');
  const [stockDataList, setStockDataList] = useState<any[]>([]);
  const [userUpdated, setUserUpdated] = useState(false);

  const saveReset = async () => {
    try {
      const data = await getStockData(ticker);

      if (stockDataList.length === 4) {
        // Assuming you have a user ID (replace 'your-user-id' with the actual user ID)
        const userId = 'your-user-id';

        // Get the user document reference
        const userDocRef = doc(collection(app, 'users'), userId);

        // Update the user document with the new stock data
        await updateDoc(userDocRef, {
          stocks: [...stockDataList, { ticker: data.ticker, name: data.name }],
        });

        setUserUpdated(true);
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getStockData = async (symbol: any) => {
    if (stockDataList.length >= 5) {
      console.log('Max number of stocks reached');
      toast.error('Max number of stocks reached');
      return;
    }

    const apiKey = '0asLfTPzTAe9WSPJHa1CNzp9pvbdhX9h';
    try {
      const response = await fetch(
        `https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${apiKey}`,
      );
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
      const data = await response.json();
      const ticker = data.results.ticker;
      const name = data.results.name;

      setStockDataList([...stockDataList, { ticker, name }]);
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (userUpdated) {
      // Do something after user data is updated, if needed
      console.log('User data updated:', stockDataList);
    }
  }, [userUpdated, stockDataList]);

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
          value={ticker}
        />
        <Button disabled={!ticker} onClick={saveReset}>
          Enter
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticker</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockDataList.map((stockData, index) => (
            <TableRow key={index}>
              <TableCell>{stockData.ticker}</TableCell>
              <TableCell>{stockData.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
