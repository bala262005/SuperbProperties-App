
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSupabase } from "@/hooks/useSupabase";

type Property = {
  id: number;
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
};

export default function HomeScreen() {
  const supabase = useSupabase();

  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
    setFilteredProperties(data ?? []);
    setLoading(false);
  };

  const handleSearch = (text: string) => {
    setSearch(text);

    if (text.trim() === "") {
      setFilteredProperties(properties);
      return;
    }

    const searchText = text.toLowerCase();

    const filtered = properties.filter(
      (property) =>
        property.city.toLowerCase().includes(searchText) ||
        property.title.toLowerCase().includes(searchText) ||
        property.type.toLowerCase().includes(searchText)
    );

    setFilteredProperties(filtered);
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const renderProperty = ({ item }: { item: Property }) => {
    return (
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          marginBottom: 18,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#E5E7EB",
        }}
      >
        {/* Property Image */}
        {item.images && item.images.length > 0 && (
          <Image
            source={{ uri: item.images[0] }}
            style={{
              width: "100%",
              height: 220,
            }}
            resizeMode="cover"
          />
        )}

        <View style={{ padding: 14 }}>
          {/* Featured */}
          {item.is_featured && (
            <View
              style={{
                alignSelf: "flex-start",
                backgroundColor: "#2563EB",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 5,
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                FEATURED
              </Text>
            </View>
          )}

          {/* Title */}
          <Text
            style={{
              fontSize: 19,
              fontWeight: "bold",
              color: "#111827",
            }}
          >
            {item.title}
          </Text>

          {/* Location */}
          <Text
            style={{
              marginTop: 5,
              color: "#6B7280",
              fontSize: 14,
            }}
          >
            📍 {item.city}
          </Text>

          {/* Price */}
          <Text
            style={{
              marginTop: 8,
              color: "#2563EB",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {formatPrice(item.price)}
          </Text>

          {/* Details */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              gap: 16,
            }}
          >
            <Text style={{ color: "#4B5563" }}>
              🛏 {item.bedrooms} Beds
            </Text>

            <Text style={{ color: "#4B5563" }}>
              🛁 {item.bathrooms} Baths
            </Text>

            <Text style={{ color: "#4B5563" }}>
              📐 {item.area_sqft} sqft
            </Text>
          </View>

          {/* Type */}
          <Text
            style={{
              marginTop: 8,
              color: "#6B7280",
              textTransform: "capitalize",
            }}
          >
            {item.type}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
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

        {/* Search */}
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="Search city, property or type..."
          placeholderTextColor="#6B7280"
          style={{
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#D1D5DB",
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
          }}
        />
      </View>

      {/* Loading */}
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" />

          <Text style={{ marginTop: 10, color: "#6B7280" }}>
            Loading properties...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProperties}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProperty}
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
                }}
              >
                Try searching another city or property.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

