import React from "react"
import { CoffeeShop } from "../../overpassapi"

interface CoffeeShopsProps {
  coffeeShops: CoffeeShop[]
  currentPage: number
  onPageChange: (newPage: number) => void
}

const CoffeeShops: React.FC<CoffeeShopsProps> = ({
  coffeeShops,
  currentPage,
  onPageChange,
}) => {
  const ITEMS_PER_PAGE = 10
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const sortedCoffeeShops = coffeeShops?.sort((a, b) =>
    a.tags.name.localeCompare(b.tags.name)
  )

  return (
    <>
      <ul>
        {sortedCoffeeShops?.slice(startIndex, endIndex).map((coffeeShop) => (
          <li key={coffeeShop.id}>{coffeeShop.tags.name}</li>
        ))}
      </ul>
      {sortedCoffeeShops && sortedCoffeeShops.length > 0 && (
        <div className="pagination-container">
          {Array.from(
            {
              length: Math.ceil(coffeeShops.length / ITEMS_PER_PAGE),
            },
            (_, index) => (
              <button key={index + 1} onClick={() => onPageChange(index + 1)}>
                {index + 1}
              </button>
            )
          )}
        </div>
      )}
    </>
  )
}

export default CoffeeShops
