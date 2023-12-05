'use client'
import React, { use, useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  DocumentData,
  updateDoc,
} from 'firebase/firestore'
import { firebaseConfig } from '@/lib/firebase'

// const app = initializeApp(firebaseConfig)
import { app, fireStore, getUsers, getPicks } from '@/lib/firebase'

interface UserData {
  percent: any
  pick: any
  date(ticker: any, date: any): unknown
  stocks: any
  id: number
  name: string
  user: DocumentData
}

const Stats = () => {
  const [userData, setUserData] = useState<UserData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const picksSnapshot = getPicks()
        const picksData = (await picksSnapshot).docs.map((doc) => ({
          documentName: doc.id,
          data: doc.data(),
        }))
        // Create a map to store the latest picks for each UID
        const latestPicksMap = new Map()

        // Filter out duplicates and keep only the most recent picks
        picksData.forEach((pick) => {
          const [uid, date] = pick.documentName.split('_')
          const existingPick = latestPicksMap.get(uid)

          // If there's no existing pick or the current pick is more recent, update the map
          if (!existingPick || new Date(date) > new Date(existingPick.date)) {
            latestPicksMap.set(uid, { ...pick, date })
          }
        })
        // Fetch user data based on UID from the filtered picks data
        const userPromises = Array.from(latestPicksMap.values()).map(
          async (latestPick) => {
            const [uid, date] = latestPick.documentName.split('_')

            // Use the correct collection reference

            const usersCollectionRef = collection(fireStore, 'users')
            const userDocRef = doc(usersCollectionRef, uid)
            const userDoc = await getDoc(userDocRef)

            if (userDoc.exists()) {
              const userData = userDoc.data()
              return { pick: latestPick.data, user: userData, date }
            } else {
              console.warn(
                `User document not found for UID: ${uid}. Ignoring from the list.`,
              )
              return null // Ignore this pick from the list
            }
          },
        )

        // Filter out null values (picks with no matching user)
        const validUserPromises = userPromises.filter(
          (userPromise) => userPromise !== null,
        )

        const result = await Promise.all(validUserPromises)

        // Filter out null values (picks with no matching user)
        const validResults: { pick: any; user: DocumentData; date: any }[] =
          result.filter(
            (item): item is { pick: any; user: DocumentData; date: any } =>
              item !== null,
          )

        // Convert DocumentData to UserData

        // @ts-ignore
        const userDataArray: UserData[] = validResults.map(
          // @ts-ignore
          ({ uid, pick, user, date }) => ({
            uid,
            pick,
            user: user as DocumentData, // Assuming you have a type for DocumentData
            date,
          }),
        )
        console.log('userDataArray', userDataArray)
        setUserData(userDataArray)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])
  const delayBetweenCalls = (60 * 1000) / 2
  const fetchStockDataForTicker = async (
    ticker: any,
    date: (ticker: any, date: any) => unknown,
  ) => {
    console.log(`Fetching data for ${ticker}...`)
    try {
      const apiKey = '0asLfTPzTAe9WSPJHa1CNzp9pvbdhX9h'
      const apiUrl = `https://api.polygon.io/v1/open-close/${ticker}/${date}?unadjusted=true&apiKey=${apiKey}`

      // Check and update the rate limit for Polygon API
      const currentTime = Date.now()
      if (
        fetchStockDataForTicker.lastApiCallTimestamp &&
        currentTime - fetchStockDataForTicker.lastApiCallTimestamp <
          delayBetweenCalls
      ) {
        const waitTime =
          delayBetweenCalls -
          (currentTime - fetchStockDataForTicker.lastApiCallTimestamp)
        console.log(
          `Waiting for ${waitTime} milliseconds before the next API call...`,
        )
        await new Promise((resolve) => setTimeout(resolve, waitTime))
      }

      const response = await fetch(apiUrl)
      const data = await response.json()
      console.log('data', data)

      // Update the Firestore document with the retrieved data
      const userDocRef = doc(
        collection(fireStore, 'picks'),
        `${ticker}_${date}`,
      )
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        // Assuming you have a field named 'stocks' for storing stock data
        const existingStocks = userDoc.data().stocks
        const updatedStocks = existingStocks.map(
          (existingStock: { ticker: any }) => {
            if (existingStock.ticker === ticker) {
              return {
                ...existingStock,
                polygonData: data,
              }
            }
            return existingStock
          },
        )

        // Update the Firestore document
        await updateDoc(userDocRef, {
          stocks: updatedStocks,
        })
      }

      // Update the API call timestamp
      fetchStockDataForTicker.lastApiCallTimestamp = currentTime
      //calculate percent change
      //based off open high
      //open - high / open
      const percent = (data.open - data.high) / data.open
      console.log('percent', percent)
      return percent
    } catch (error) {
      console.error(`Error fetching data for ${ticker}:`, error)
      throw error
    }
  }

  // Initialize the lastApiCallTimestamp
  fetchStockDataForTicker.lastApiCallTimestamp = 0

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const makeApiCalls = async () => {
    // Restrict API calls to 4 per minute
    const maxCallsPerMinute = 2
    const delayBetweenCalls = (60 * 1000) / maxCallsPerMinute // Calculate delay in milliseconds

    for (const item of userData) {
      for (const stock of item.pick.stocks) {
        try {
          // Make the API call for each ticker
          console.log('stock', stock)
          console.log('userData', userData)
          const percent = await fetchStockDataForTicker(stock.ticker, item.date)
          //round percent to 2 decimal places
          const roundPercent = Math.round(percent * 1000) / 1000

          // Ensure that 'percent' is an array
          if (!stock.percent) {
            stock.percent = []
          }

          // Add the percentage for the current stock to its 'percent' array
          stock.percent.push(roundPercent)

          console.log('roundPercent', roundPercent)
          console.log('item', item)
          // Update the state with the new data

          // Wait for the specified delay before the next API call
          await new Promise((resolve) => setTimeout(resolve, delayBetweenCalls))
        } catch (error) {
          console.error(`Error fetching data for ${stock.ticker}:`, error)
        }
      }

      const overallPercentChange =
        item.pick.stocks.reduce((total: any, stock: { percent: any }) => {
          const stockPercent = parseFloat(stock.percent)

          // Check if stockPercent is a valid number
          if (!isNaN(stockPercent)) {
            return total + stockPercent
          } else {
            return total
          }
        }, 0) / 5
      console.log('overallPercentChange', overallPercentChange)
      // Check if overallPercentChange is a valid number
      const isValidOverallPercentChange = !isNaN(overallPercentChange)

      // Update Firestore with the new overall percent change only if it's a valid number
      if (isValidOverallPercentChange) {
        const pickDocId = `${item.user.uid}_${item.date}`
        const picksCollectionRef = collection(fireStore, 'picks')
        const pickDocRef = doc(picksCollectionRef, pickDocId)

        await updateDoc(pickDocRef, {
          percent: overallPercentChange,
        })
        console.log('Saved to Firebase!!!')
      } else {
        console.warn('Invalid overallPercentChange. Skipping Firestore update.')
      }
    }
  }

  // Trigger the API calls when userData changes
  useEffect(() => {
    makeApiCalls()
  }, [makeApiCalls, userData])

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="w-96 rounded-lg  p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-semibold">Score Board</h1>
        <ul>
          {userData.map((item, index) => (
            <li key={index} className="mb-6">
              <p className="text-lg font-bold">User: {item.user.name}</p>
              <p>Returns: {item.pick.percent}</p>
              {/* Access other properties if needed */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
export default Stats
