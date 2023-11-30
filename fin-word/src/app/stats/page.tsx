'use client'
import React, { useEffect, useState } from 'react'
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
} from 'firebase/firestore'
import { firebaseConfig } from '@/lib/firebase'

const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)
interface UserData {
  id: number
  name: string
  user: DocumentData
}

const Stats = () => {
  const [userData, setUserData] = useState<UserData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const picksQuery = query(collection(firestore, 'picks'), limit(10))
        const picksSnapshot = await getDocs(picksQuery)
        const picksData = picksSnapshot.docs.map((doc) => ({
          documentName: doc.id,
          data: doc.data(),
        }))
        console.log('picksData', picksData)

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
        console.log('latestPicksMap', latestPicksMap)
        // Fetch user data based on UID from the filtered picks data
        const userPromises = Array.from(latestPicksMap.values()).map(
          async (latestPick) => {
            const [uid, date] = latestPick.documentName.split('_')

            // Use the correct collection reference
            const usersCollectionRef = collection(firestore, 'users')
            const userDocRef = doc(usersCollectionRef, uid)
            const userDoc = await getDoc(userDocRef)

            if (userDoc.exists()) {
              const userData = userDoc.data()
              console.log('userData', userData)
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

        const userDataArray: UserData[] = validResults.map(
          ({ id, pick, user, date }) => ({
            id,
            pick,
            user: user as DocumentData, // Assuming you have a type for DocumentData
            date,
          }),
        )

        // ...

        // Set state with the converted data
        setUserData(userDataArray)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="w-96 rounded-lg  p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-semibold">Score Board</h1>
        <ul>
          {userData.map((item, index) => (
            <li key={index} className="mb-6">
              <p className="text-lg font-bold">User: {item.user.name}</p>
              <p>
                Picked Tickers:
                <ul className="ml-4 list-disc">
                  {item.pick.stocks.map((stock, idx) => (
                    <li key={idx} className="text-sm">
                      Ticker: {stock.ticker}
                    </li>
                  ))}
                </ul>
              </p>
              {/* Access other properties if needed */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
export default Stats
