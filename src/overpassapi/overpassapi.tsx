import axios from "axios"

export interface CoffeeShop {
  id: number
  tags: {
    amenity: string
    name: string
    "addr:street"?: string
  }
}

export const getCoffeeShopsNearCoordinates = async (
  latitude: number,
  longitude: number,
  radius: number
): Promise<CoffeeShop[]> => {
  const sanitizeData = ({ name }: { name?: string }): boolean => {
    return !(
      name === "Starbucks" ||
      name === "Unnamed Cafe" ||
      (name && name.includes("Internet Cafe"))
    )
  }

  try {
    const response = await axios.get(
      `https://overpass-api.de/api/interpreter?data=[out:json];(
        node["amenity"="cafe"](around:${radius},${latitude},${longitude});
        way["amenity"="cafe"](around:${radius},${latitude},${longitude});
        relation["amenity"="cafe"](around:${radius},${latitude},${longitude});
      );out center;`
    )

    const coffeeShops = response.data.elements
      .filter((cafe: CoffeeShop) => {
        const name = cafe.tags.name || "Unnamed Cafe"
        return sanitizeData({ name })
      })
      .map((cafe: any) => {
        const { id, tags } = cafe
        const name = tags.name || "Unnamed Cafe"
        const address = tags["addr:street"] || "No Address Available"
        return {
          id,
          tags: {
            amenity: tags.amenity,
            name,
            address,
          },
        }
      })

    return coffeeShops
  } catch (error) {
    console.error("Error fetching data:", error)
    throw error //Implement Error Page
  }
}
