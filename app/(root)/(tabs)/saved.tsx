import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PropertyCard from "@/components/PropertyCard";
import { useSupabase } from "@/hooks/useSupabase";

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

type SavedPropertyRow = {
  id: string;
  property_id: string;
  user_clerk_id: string;
  properties: Property | null;
};

export default function SavedScreen() {
  const supabase = useSupabase();
  const { user } = useUser();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchSavedProperties();
  }, [user]);

  const fetchSavedProperties = async () => {
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("saved_properties")
      .select(
        `
        id,
        property_id,
        user_clerk_id,
        properties (*)
        `
      )
      .eq("user_clerk_id", user.id);

    if (error) {
      console.log("SAVED PROPERTIES ERROR:", error);
      setProperties([]);
      setLoading(false);
      return;
    }

    const savedRows = (data ?? []) as unknown as SavedPropertyRow[];

    const savedProperties = savedRows
      .map((row) => row.properties)
      .filter(
        (property): property is Property =>
          property !== null
      );

    setProperties(savedProperties);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);

    await fetchSavedProperties();

    setRefreshing(false);
  };

  if (!user) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#F9FAFB",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#111827",
          }}
        >
          Sign in required
        </Text>

        <Text
          style={{
            marginTop: 8,
            color: "#6B7280",
            textAlign: "center",
          }}
        >
          Sign in to see your saved properties.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F9FAFB",
      }}
    >
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            color: "#111827",
          }}
        >
          Saved Properties
        </Text>

        <Text
          style={{
            marginTop: 4,
            color: "#6B7280",
          }}
        >
          {properties.length}{" "}
          {properties.length === 1
            ? "property"
            : "properties"}{" "}
          saved
        </Text>
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
            Loading saved properties...
          </Text>
        </View>
      ) : (
        <FlatList
          data={properties}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PropertyCard property={item} />
          )}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 30,
            flexGrow: properties.length === 0 ? 1 : 0,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 30,
              }}
            >
              <Text
                style={{
                  fontSize: 50,
                }}
              >
                🤍
              </Text>

              <Text
                style={{
                  marginTop: 15,
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#111827",
                }}
              >
                No saved properties
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  color: "#6B7280",
                  textAlign: "center",
                }}
              >
                Properties you save will appear here.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}