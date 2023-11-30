'use client'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { firebaseConfig } from '@/lib/firebase'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const firestore = getFirestore(app)
interface StockData {
  ticker: string
  name: string
}

const Results = () => {
  const [user] = useAuthState(auth)
  const [stockDataList, setStockDataList] = useState<StockData[]>([])
  const [date, setDate] = useState('')

  useEffect(() => {
    const fetchResultsData = async () => {
      if (user) {
        const userId = user.uid

        // Determine the last market day (assuming Saturday and Sunday are off)
        const currentDate = new Date()
        const dayOfWeek = currentDate.getDay()

        let lastMarketDay
        if (dayOfWeek === 1) {
          // If today is Monday, last market day was Friday
          lastMarketDay = new Date(currentDate)
          lastMarketDay.setDate(currentDate.getDate() - 3)
        } else {
          // For other days, last market day was yesterday
          lastMarketDay = new Date(currentDate)
          lastMarketDay.setDate(currentDate.getDate() - 1)
        }

        const year = currentDate.getFullYear()
        const month = String(currentDate.getMonth() + 1).padStart(2, '0')
        const day = String(currentDate.getDate()).padStart(2, '0')

        const yesterdayFormatted = `${year}-${month}-${day}`
        setDate(yesterdayFormatted)
        // Construct the document ID based on user ID and yesterday's date
        const documentId = `${userId}_${yesterdayFormatted}`

        // Query to get the results data for yesterday based on UID
        const q = query(
          collection(firestore, 'picks'),
          where('__name__', '==', documentId),
        )

        try {
          const querySnapshot = await getDocs(q)
          const data: StockData[] = []

          querySnapshot.forEach((doc) => {
            const stocksData = doc.data().stocks

            // Assuming stocks is an array with 5 items, each having name and ticker properties
            stocksData.forEach((stock: StockData) => {
              data.push(stock)
            })
          })
          console.log('data', data)
          setStockDataList(data)
        } catch (error) {
          console.error('Error fetching results data:', error)
        }
      }
    }

    fetchResultsData()
  }, [user])

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex items-center justify-center">
        <Label htmlFor="ticker">Your Picks {date}</Label>
      </div>
      <div className="v-screen flex items-center justify-center">
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

export default Results
