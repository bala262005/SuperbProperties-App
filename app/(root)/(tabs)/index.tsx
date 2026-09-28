import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PropertyCard from "@/components/PropertyCard";
import { useSupabase } from "@/hooks/useSupabase";
import { useFilterStore } from "@/store/filterStore";

type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  images: string[];
  is_featured: boolean;
  is_sold?: boolean;
};

export default function HomeScreen() {
  const supabase = useSupabase();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const search = useFilterStore((state) => state.search);
  const setSearch = useFilterStore((state) => state.setSearch);

  const city = useFilterStore((state) => state.city);
  const type = useFilterStore((state) => state.type);
  const minPrice = useFilterStore((state) => state.minPrice);
  const maxPrice = useFilterStore((state) => state.maxPrice);
  const bedrooms = useFilterStore((state) => state.bedrooms);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("is_featured", { ascending: false });

    if (error) {
      console.log("Error fetching properties:", error);
      setLoading(false);
      return;
    }

    setProperties(data ?? []);
    setLoading(false);
  };

  const filteredProperties = properties.filter((property) => {
    const searchText = search.toLowerCase().trim();
    const cityText = city.toLowerCase().trim();
    const typeText = type.toLowerCase().trim();

    const matchesSearch =
      searchText === "" ||
      property.title.toLowerCase().includes(searchText) ||
      property.city.toLowerCase().includes(searchText) ||
      property.type.toLowerCase().includes(searchText);

    const matchesCity =
      cityText === "" ||
      property.city.toLowerCase().includes(cityText);

    const matchesType =
      typeText === "" ||
      property.type.toLowerCase().includes(typeText);

    const matchesMinPrice =
      minPrice === 0 || property.price >= minPrice;

    const matchesMaxPrice =
      maxPrice === 0 || property.price <= maxPrice;

    const matchesBedrooms =
      bedrooms === 0 || property.bedrooms >= bedrooms;

    return (
      matchesSearch &&
      matchesCity &&
      matchesType &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesBedrooms
    );
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 12,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#111827",
            marginBottom: 14,
          }}
        >
          Find Your Property
        </Text>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search city, property or type..."
          placeholderTextColor="#6B7280"
          style={{
            backgroundColor: "#efad67",
            borderWidth: 1,
            borderColor: "#D1D5DB",
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
          }}
        />
      </View>

      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" />

          <Text
            style={{
              marginTop: 10,
              color: "#6B7280",
            }}
          >
            Loading properties...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProperties}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PropertyCard property={item} />
          )}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 30,
          }}
          ListEmptyComponent={
            <View
              style={{
                alignItems: "center",
                marginTop: 50,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#374151",
                }}
              >
                No properties found
              </Text>

              <Text
                style={{
                  marginTop: 6,
                  color: "#6B7280",
                  textAlign: "center",
                }}
              >
                Try changing your search or filters.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}