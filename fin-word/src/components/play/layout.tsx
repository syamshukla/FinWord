'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { db, firebaseConfig, app, auth, fireStore } from '@/lib/firebase/index'
import { useAuthState } from 'react-firebase-hooks/auth'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { getAuth } from 'firebase/auth'

import { collection, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

export default function PlayLayout() {
  const [ticker, setTicker] = useState('')
  const [stockDataList, setStockDataList] = useState<any[]>([])
  const [userUpdated, setUserUpdated] = useState(false)
  const [user] = useAuthState(auth) // Assuming you are using Firebase Authentication
  const currentDate = new Date().toISOString().split('T')[0]
  const router = useRouter()
  //check if user exists before allowing them to play user.uid
  useEffect(() => {
    const user = getAuth().currentUser
    if (user) {
      console.log('user exists')
    } else {
      console.log('user does not exist')
      router.push('/login')
    }
  }, [router])
  const saveReset = async () => {
    try {
      const data = await getStockData(ticker)

      if (stockDataList.length === 4 && user) {
        const userId = user.uid
        
        // Create a document reference with an even number of segments
        const documentId = `${userId}_${currentDate}`
        const userDocRef = doc(collection(fireStore, 'picks'), documentId)
        console.log('Document reference path:', userDocRef.path)

        // Check if the document exists
        const docSnap = await getDoc(userDocRef)
        const docExists = docSnap.exists()
        console.log('Document exists:', docExists)
        console.log('stockDataList', stockDataList)
        if (docExists) {
          // Update the existing document with the new stock data
          await updateDoc(userDocRef, {
            stocks: [
              ...stockDataList,
              { ticker: data.results.ticker, name: data.results.name },
            ],
          })
        } else {
          console.log('ticker data', data)

          // Create a new document with the updated stock data list
          await setDoc(userDocRef, {
            stocks: [
              ...stockDataList,
              { ticker: data.results.ticker, name: data.results.name },
            ],
          })
        }
        setUserUpdated(true)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getStockData = async (symbol: any) => {
    if (stockDataList.length >= 5) {
      console.log('Max number of stocks reached')
      toast.error('Max number of stocks reached')
      return
    }

    const apiKey = '0asLfTPzTAe9WSPJHa1CNzp9pvbdhX9h'
    try {
      const response = await fetch(
        `https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${apiKey}`,
      )
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`)
      }
      const data = await response.json()
      const ticker = data.results.ticker
      const name = data.results.name

      setStockDataList([...stockDataList, { ticker, name }])
      console.log(data)
      return data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    if (userUpdated) {
      // Do something after user data is updated, if needed
      console.log('User data updated:', stockDataList)
    }
  }, [userUpdated, stockDataList])

  return (
    <div className="flex h-screen w-full max-w-lg flex-col items-center justify-center">
      <div className="flex w-full  flex-col items-center gap-1.5">
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
      <div className="flex w-full flex-col items-center gap-1.5">
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
    </div>
  )
}
