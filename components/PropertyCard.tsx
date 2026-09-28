import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

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

type PropertyCardProps = {
  property: Property;
};

export default function PropertyCard({
  property,
}: PropertyCardProps) {
  const router = useRouter();

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const openDetails = () => {
    console.log("OPENING PROPERTY:", property.id);

    router.push({
      pathname: "/property",
      params: {
        id: property.id,
      },
    });
  };

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
      {property.images?.length > 0 ? (
        <Image
          source={{
            uri: property.images[0],
          }}
          style={{
            width: "100%",
            height: 220,
          }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: "100%",
            height: 220,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#E5E7EB",
          }}
        >
          <Text>No image available</Text>
        </View>
      )}

      <View style={{ padding: 14 }}>
        {property.is_sold && (
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#DC2626",
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
              SOLD
            </Text>
          </View>
        )}

        {property.is_featured && !property.is_sold && (
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

        <Text
          style={{
            fontSize: 19,
            fontWeight: "bold",
            color: "#111827",
          }}
        >
          {property.title}
        </Text>

        <Text
          style={{
            marginTop: 5,
            color: "#010308",
            fontSize: 14,
          }}
        >
          📍 {property.city}
        </Text>

        <Text
          style={{
            marginTop: 8,
            color: "#25eb4d",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          {formatPrice(property.price)}
        </Text>

        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
            gap: 16,
          }}
        >
          <Text style={{ color: "#4B5563" }}>
            🛏 {property.bedrooms} Beds
          </Text>

          <Text style={{ color: "#4B5563" }}>
            🛁 {property.bathrooms} Baths
          </Text>

          <Text style={{ color: "#4B5563" }}>
            📐 {property.area_sqft} sqft
          </Text>
        </View>

        <Text
          style={{
            marginTop: 8,
            color: "#6B7280",
            textTransform: "capitalize",
          }}
        >
          {property.type}
        </Text>

        <TouchableOpacity
          onPress={openDetails}
          activeOpacity={0.7}
          style={{
            marginTop: 12,
            backgroundColor: "#2563EB",
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            View Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}