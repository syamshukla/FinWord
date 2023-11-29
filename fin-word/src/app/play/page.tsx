import { auth } from '@/lib/firebase';
import { firestore } from '@/lib/firebase/useController';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import dynamic from 'next/dynamic'
const PlayLayout = dynamic(() => import('@/components/play/layout'), {
  ssr: false,
})
import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Page() {
  const [ticker, setTicker] = useState('');
  const [stockDataList, setStockDataList] = useState<any[]>([]);
  const [userUpdated, setUserUpdated] = useState(false);
  const [user] = useAuthState(auth); // Assuming you are using Firebase Authentication
  const currentDate = new Date().toISOString().split('T')[0];

  const saveReset = async () => {
    try {
      const data = await getStockData(ticker);

      if (stockDataList.length === 4 && user) {
        const userId = user.uid;

        // Create a document reference with an even number of segments
        const documentId = `${userId}_${currentDate}`;
        const userDocRef = doc(collection(firestore, 'picks'), documentId);
        console.log('Document reference path:', userDocRef.path);
        

        const docSnap = await getDoc(userDocRef);
        const docExists = docSnap.exists();
        console.log('Document exists:', docExists);
        console.log('stockDataList', stockDataList);
        if (docExists) {
  // Update the existing document with the new stock data
  await updateDoc(userDocRef, {
    stocks: [...stockDataList, { ticker: data.results.ticker, name: data.results.name }],
  });
} else {
  console.log("ticker data", data);

  // Create a new document with the updated stock data list
  await setDoc(userDocRef, {
    stocks: [...stockDataList, { ticker: data.results.ticker, name: data.results.name }],
  });
}
        setUserUpdated(true);
      }
    } catch (error) {
      console.error('Error:', error);
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
    <div>
      <PlayLayout />
    </div>
  )
}
