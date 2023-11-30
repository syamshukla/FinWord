'use client'
import React, { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
} from 'firebase/firestore'
import { firebaseConfig } from '@/lib/firebase'
import { Label } from '@/components/ui/label'

const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)

const Page = () => {
  const [userData, setUserData] = useState([])

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
            const userDocRef = doc(collection(firestore, 'users', uid))
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
        console.log('result', result)
        setUserData(result)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex items-center justify-center">
        <Label htmlFor="ticker">Score Board</Label>
        <ul>
          {userData.map((item, index) => (
            <li key={index}>
              <p>User ID: {item.user}</p>
              <p>Pick Ticker: {item.pick}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Page
