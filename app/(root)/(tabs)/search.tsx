import {
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFilterStore } from "@/store/filterStore";

export default function SearchScreen() {
  const {
    search,
    setSearch,
    city,
    setCity,
    type,
    setType,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    bedrooms,
    setBedrooms,
    resetFilters,
  } = useFilterStore();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            color: "#111827",
            marginBottom: 20,
          }}
        >
          Search Properties
        </Text>

        {/* Search */}
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: "#374151",
            marginBottom: 8,
          }}
        >
          Search
        </Text>

        <TextInput
          value={search}
          onChangeText={setSearch}
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
            marginBottom: 18,
          }}
        />

        {/* City */}
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: "#374151",
            marginBottom: 8,
          }}
        >
          City
        </Text>

        <TextInput
          value={city}
          onChangeText={setCity}
          placeholder="e.g. Mumbai"
          placeholderTextColor="#6B7280"
          style={{
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#D1D5DB",
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
            marginBottom: 18,
          }}
        />

        {/* Property Type */}
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: "#374151",
            marginBottom: 8,
          }}
        >
          Property Type
        </Text>

        <TextInput
          value={type}
          onChangeText={setType}
          placeholder="e.g. apartment, villa, house"
          placeholderTextColor="#6B7280"
          style={{
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#D1D5DB",
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
            marginBottom: 18,
          }}
        />

        {/* Minimum Price */}
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: "#374151",
            marginBottom: 8,
          }}
        >
          Minimum Price
        </Text>

        <TextInput
          value={minPrice === 0 ? "" : String(minPrice)}
          onChangeText={(text) => {
            if (text === "") {
              setMinPrice(0);
              return;
            }

            const value = parseInt(text, 10);

            if (!isNaN(value)) {
              setMinPrice(value);
            }
          }}
          placeholder="e.g. 3000000"
          placeholderTextColor="#6B7280"
          keyboardType="number-pad"
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
          style={{
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#D1D5DB",
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
            marginBottom: 18,
          }}
        />

        {/* Maximum Price */}
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: "#374151",
            marginBottom: 8,
          }}
        >
          Maximum Price
        </Text>

        <TextInput
          value={maxPrice === 0 ? "" : String(maxPrice)}
          onChangeText={(text) => {
            if (text === "") {
              setMaxPrice(0);
              return;
            }

            const value = parseInt(text, 10);

            if (!isNaN(value)) {
              setMaxPrice(value);
            }
          }}
          placeholder="e.g. 20000000"
          placeholderTextColor="#6B7280"
          keyboardType="number-pad"
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
          style={{
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#D1D5DB",
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
            marginBottom: 18,
          }}
        />

        {/* Bedrooms */}
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: "#374151",
            marginBottom: 8,
          }}
        >
          Bedrooms
        </Text>

        <TextInput
          value={bedrooms === 0 ? "" : String(bedrooms)}
          onChangeText={(text) => {
            if (text === "") {
              setBedrooms(0);
              return;
            }

            const value = parseInt(text, 10);

            if (!isNaN(value)) {
              setBedrooms(value);
            }
          }}
          placeholder="e.g. 3"
          placeholderTextColor="#6B7280"
          keyboardType="number-pad"
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
          style={{
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#D1D5DB",
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
            marginBottom: 24,
          }}
        />

        {/* Done / Hide Keyboard */}
        <TouchableOpacity
          onPress={() => Keyboard.dismiss()}
          style={{
            backgroundColor: "#111827",
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Done
          </Text>
        </TouchableOpacity>

        {/* Reset */}
        <TouchableOpacity
          onPress={resetFilters}
          style={{
            backgroundColor: "#2563EB",
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Reset Filters
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}