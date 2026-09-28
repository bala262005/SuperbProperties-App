import { useSupabase } from "@/hooks/useSupabase";
import { useUserStore } from "@/store/userStore";
import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreatePropertyScreen() {
  const router = useRouter();
  const supabase = useSupabase();

  const isAdmin = useUserStore((state) => state.isAdmin);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [areaSqft, setAreaSqft] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [images, setImages] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const [saving, setSaving] = useState(false);

  // Extra protection:
  // Only admins can access this screen.
  if (!isAdmin) {
    return <Redirect href="/(root)/(tabs)" />;
  }

  const addProperty = async () => {
    if (
      !title.trim() ||
      !description.trim() ||
      !price.trim() ||
      !type.trim() ||
      !bedrooms.trim() ||
      !bathrooms.trim() ||
      !areaSqft.trim() ||
      !address.trim() ||
      !city.trim()
    ) {
      Alert.alert(
        "Missing Information",
        "Please fill in all required fields."
      );
      return;
    }

    const priceNumber = Number(price);
    const bedroomsNumber = Number(bedrooms);
    const bathroomsNumber = Number(bathrooms);
    const areaNumber = Number(areaSqft);

    if (
      Number.isNaN(priceNumber) ||
      Number.isNaN(bedroomsNumber) ||
      Number.isNaN(bathroomsNumber) ||
      Number.isNaN(areaNumber)
    ) {
      Alert.alert(
        "Invalid Information",
        "Price, bedrooms, bathrooms and area must be numbers."
      );
      return;
    }

    const latitudeNumber = latitude.trim()
      ? Number(latitude)
      : null;

    const longitudeNumber = longitude.trim()
      ? Number(longitude)
      : null;

    if (
      (latitude.trim() && Number.isNaN(latitudeNumber)) ||
      (longitude.trim() && Number.isNaN(longitudeNumber))
    ) {
      Alert.alert(
        "Invalid Location",
        "Latitude and longitude must be valid numbers."
      );
      return;
    }

    const imageArray = images
      .split(",")
      .map((image) => image.trim())
      .filter((image) => image.length > 0);

    setSaving(true);

    const { error } = await supabase
      .from("properties")
      .insert({
        title: title.trim(),
        description: description.trim(),
        price: priceNumber,
        type: type.trim().toLowerCase(),
        bedrooms: bedroomsNumber,
        bathrooms: bathroomsNumber,
        area_sqft: areaNumber,
        address: address.trim(),
        city: city.trim(),
        latitude: latitudeNumber,
        longitude: longitudeNumber,
        images: imageArray,
        is_featured: isFeatured,
        is_sold: false,
      });

    setSaving(false);

    if (error) {
      console.log("ADD PROPERTY ERROR:", error);

      Alert.alert(
        "Error",
        "Could not add the property. Please try again."
      );

      return;
    }

    Alert.alert(
      "Property Added",
      "The property has been successfully added.",
      [
        {
          text: "OK",
          onPress: () => {
            router.replace("/(root)/(tabs)");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8FAFC",
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 40,
          }}
        >
          {/* Header */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 27,
                fontWeight: "bold",
                color: "#111827",
              }}
            >
              Add Property
            </Text>

            <Text
              style={{
                marginTop: 5,
                color: "#1e5ad3",
                fontSize: 14,
              }}
            >
              Add a new property to SuperbProperties
            </Text>
          </View>

          {/* Basic Information */}
          <View
            style={{
              backgroundColor: "#fbdda6",
              borderRadius: 12,
              padding: 16,
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#111827",
                marginBottom: 15,
              }}
            >
              Basic Information
            </Text>

            <Text style={labelStyle}>Property Title *</Text>

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Example: Modern Luxury Villa"
              placeholderTextColor="#9CA3AF"
              style={inputStyle}
            />

            <Text style={labelStyle}>Description *</Text>

            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the property..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              style={[
                inputStyle,
                {
                  height: 120,
                },
              ]}
            />

            <Text style={labelStyle}>Property Type *</Text>

            <TextInput
              value={type}
              onChangeText={setType}
              placeholder="villa / apartment / house / studio"
              placeholderTextColor="#9CA3AF"
              style={inputStyle}
            />
          </View>

          {/* Property Details */}
          <View
            style={{
              backgroundColor: "#fbdda6",
              borderRadius: 12,
              padding: 16,
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#111827",
                marginBottom: 15,
              }}
            >
              Property Details
            </Text>

            <Text style={labelStyle}>Price (₹) *</Text>

            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="12500000"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              style={inputStyle}
            />

            <Text style={labelStyle}>Bedrooms *</Text>

            <TextInput
              value={bedrooms}
              onChangeText={setBedrooms}
              placeholder="4"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              style={inputStyle}
            />

            <Text style={labelStyle}>Bathrooms *</Text>

            <TextInput
              value={bathrooms}
              onChangeText={setBathrooms}
              placeholder="3"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              style={inputStyle}
            />

            <Text style={labelStyle}>Area (sqft) *</Text>

            <TextInput
              value={areaSqft}
              onChangeText={setAreaSqft}
              placeholder="3200"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              style={inputStyle}
            />
          </View>

          {/* Location */}
          <View
            style={{
              backgroundColor: "#550c0c",
              borderRadius: 12,
              padding: 16,
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#e3e6ee",
                marginBottom: 15,
              }}
            >
              Location
            </Text>

            <Text style={labelStyle}>Address *</Text>

            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Full property address"
              placeholderTextColor="#f4f5f7"
              style={inputStyle}
            />

            <Text style={labelStyle}>City *</Text>

            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="Mumbai"
              placeholderTextColor="#84878b"
              style={inputStyle}
            />

            <Text style={labelStyle}>Latitude</Text>

            <TextInput
              value={latitude}
              onChangeText={setLatitude}
              placeholder="19.0760"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              style={inputStyle}
            />

            <Text style={labelStyle}>Longitude</Text>

            <TextInput
              value={longitude}
              onChangeText={setLongitude}
              placeholder="72.8777"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              style={inputStyle}
            />
          </View>

          {/* Images */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              padding: 16,
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#111827",
                marginBottom: 5,
              }}
            >
              Property Images
            </Text>

            <Text
              style={{
                color: "#6B7280",
                fontSize: 13,
                marginBottom: 12,
              }}
            >
              Enter image URLs separated by commas.
            </Text>

            <TextInput
              value={images}
              onChangeText={setImages}
              placeholder="https://image1.jpg, https://image2.jpg"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              style={[
                inputStyle,
                {
                  height: 100,
                },
              ]}
            />
          </View>

          {/* Featured */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => setIsFeatured(!isFeatured)}
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                borderWidth: 2,
                borderColor: "#2563EB",
                backgroundColor: isFeatured
                  ? "#2563EB"
                  : "#FFFFFF",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isFeatured && (
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </Text>
              )}
            </TouchableOpacity>

            <View style={{ marginLeft: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#111827",
                }}
              >
                Featured Property
              </Text>

              <Text
                style={{
                  color: "#6B7280",
                  fontSize: 13,
                  marginTop: 2,
                }}
              >
                Show this property at the top of listings
              </Text>
            </View>
          </View>

          {/* Add Button */}
          <TouchableOpacity
            onPress={addProperty}
            disabled={saving}
            activeOpacity={0.8}
            style={{
              backgroundColor: saving
                ? "#93C5FD"
                : "#2563EB",
              paddingVertical: 16,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 17,
                fontWeight: "bold",
              }}
            >
              {saving ? "Adding Property..." : "Add Property"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const labelStyle = {
  fontSize: 14,
  fontWeight: "600" as const,
  color: "#374151",
  marginBottom: 7,
};

const inputStyle = {
  backgroundColor: "#F9FAFB",
  borderWidth: 1,
  borderColor: "#D1D5DB",
  borderRadius: 9,
  paddingHorizontal: 13,
  paddingVertical: 12,
  fontSize: 15,
  color: "#111827",
  marginBottom: 15,
};