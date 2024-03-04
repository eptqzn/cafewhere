import React, { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { CoffeeShop, getCoffeeShopsNearCoordinates } from "./overpassapi"
import "./App.css"
import CoffeeShops from "./components/coffeeshops/CoffeeShops"

interface Coordinates {
  latitude: number
  longitude: number
}

const locations = {
  SM_CLARK: { latitude: 15.1673, longitude: 120.5801 },
  MARQUEE: { latitude: 15.1626, longitude: 120.6099 },
  HRPC: { latitude: 15.1344, longitude: 120.5902 },
}

const RADIUS = 3000 // meters

const App: React.FC = () => {
  const [coordinates, setCoordinates] = useState<Coordinates>({
    latitude: 0,
    longitude: 0,
  })
  const [currentPage, setCurrentPage] = useState(1)

  const {
    data: coffeeShops,
    refetch,
    isLoading,
    isError,
    isSuccess,
  } = useQuery<CoffeeShop[]>(
    ["coffeeShops", coordinates],
    () =>
      getCoffeeShopsNearCoordinates(
        coordinates.latitude,
        coordinates.longitude,
        RADIUS
      ),
    {
      enabled: false,
    }
  )

  const [initialLoad, setInitialLoad] = useState(true)

  const onClickLandmarkHandler = (location: Coordinates) => {
    setCoordinates(location)
    setCurrentPage(1) // Reset to the first page when location changes
  }

  const onPageChangeHandler = (newPage: number) => {
    setCurrentPage(newPage)
  }

  useEffect(() => {
    const fetchData = async () => {
      await refetch()
      setInitialLoad(false)
    }

    fetchData()
  }, [coordinates, refetch])

  return (
    <div className="app-container">
      <h1 className="cafe-where-header">Cafe Where?</h1>
      <div className="buttons-container">
        <button onClick={() => onClickLandmarkHandler(locations.SM_CLARK)}>
          SM Clark
        </button>
        <button onClick={() => onClickLandmarkHandler(locations.MARQUEE)}>
          Marquee Mall
        </button>
        <button onClick={() => onClickLandmarkHandler(locations.HRPC)}>
          HRPC
        </button>
      </div>
      {isLoading && initialLoad && <p>Finding Cafes</p>}
      {isError && <p>Error fetching data</p>}
      {isSuccess && (
        <>
          <CoffeeShops
            coffeeShops={coffeeShops}
            currentPage={currentPage}
            onPageChange={onPageChangeHandler}
          />
        </>
      )}
    </div>
  )
}

export default App
