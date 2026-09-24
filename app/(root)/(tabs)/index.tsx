import {
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const properties = [
  {
    id: 1,
    title: "Luxury Apartment",
    city: "Chennai",
    price: "25L",
  },
  {
    id: 2,
    title: "Beachside Villa",
    city: "Goa",
    price: "75L",
  },
  {
    id: 3,
    title: "Modern House",
    city: "Bangalore",
    price: "45L",
  },
  {
    id: 4,
    title: "Premium Flat",
    city: "Mumbai",
    price: "60L",
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-900 mb-4">
          Welcome To My App
        </Text>

        <TextInput
          placeholder="Search City.."
          placeholderTextColor="#874848"
          style={{
            borderWidth: 1,
            borderColor: "#130a0a",
            borderRadius: 8,
            padding: 10,
          }}
        />

        <TouchableOpacity
          onPress={() => alert("Searching...")}
          style={{
            backgroundColor: "#2563EB",
            padding: 12,
            borderRadius: 6,
            marginTop: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Search
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={properties}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
            <Text style={{ color: "#666" }}>{item.city}</Text>
            <Text style={{ color: "#2563EB" }}>{item.price}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}