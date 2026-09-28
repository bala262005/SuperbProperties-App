import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSupabase } from "@/hooks/useSupabase";
import { useUserStore } from "@/store/userStore";

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

export default function PropertyDetails() {
  const router = useRouter();
  const supabase = useSupabase();
  const { user } = useUser();

  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id;

  const isAdmin = useUserStore((state) => state.isAdmin);

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  const [imageIndex, setImageIndex] = useState(0);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [readMore, setReadMore] = useState(false);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [contactVisible, setContactVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    fetchProperty();
  }, [id]);

  useEffect(() => {
    if (!id || !user) return;

    checkSaved();
  }, [id, user]);

  const fetchProperty = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log("PROPERTY ERROR:", error);
      setProperty(null);
      setLoading(false);
      return;
    }

    setProperty(data);
    setLoading(false);
  };

  const checkSaved = async () => {
    if (!id || !user) return;

    const { data, error } = await supabase
      .from("saved_properties")
      .select("id")
      .eq("property_id", id)
      .eq("user_clerk_id", user.id)
      .maybeSingle();

    if (error) {
      console.log("CHECK SAVED ERROR:", error);
      return;
    }

    setSaved(!!data);
  };

  const toggleSave = async () => {
    if (!user) {
      Alert.alert(
        "Sign In Required",
        "Please sign in to save properties."
      );
      return;
    }

    if (!property) return;

    setSaving(true);

    if (saved) {
      const { error } = await supabase
        .from("saved_properties")
        .delete()
        .eq("property_id", property.id)
        .eq("user_clerk_id", user.id);

      if (error) {
        console.log("UNSAVE ERROR:", error);

        Alert.alert(
          "Error",
          "Could not remove this property from saved properties."
        );

        setSaving(false);
        return;
      }

      setSaved(false);
    } else {
      const { error } = await supabase
        .from("saved_properties")
        .insert({
          property_id: property.id,
          user_clerk_id: user.id,
        });

      if (error) {
        console.log("SAVE ERROR:", error);

        Alert.alert(
          "Error",
          "Could not save this property."
        );

        setSaving(false);
        return;
      }

      setSaved(true);
    }

    setSaving(false);
  };

  const openLocation = () => {
    if (!property) return;

    const url =
      `https://www.google.com/maps/search/?api=1&query=` +
      `${property.latitude},${property.longitude}`;

    Linking.openURL(url);
  };

  const contactAdmin = () => {
    if (!message.trim()) {
      Alert.alert(
        "Message Required",
        "Please enter a message before contacting the admin."
      );
      return;
    }

    Alert.alert(
      "Message Sent",
      "Your enquiry has been recorded. The admin can contact you regarding this property.",
      [
        {
          text: "OK",
          onPress: () => {
            setMessage("");
            setContactVisible(false);
          },
        },
      ]
    );
  };

  const markSold = async () => {
    if (!property) return;

    const { error } = await supabase
      .from("properties")
      .update({
        is_sold: !property.is_sold,
      })
      .eq("id", property.id);

    if (error) {
      console.log("MARK SOLD ERROR:", error);

      Alert.alert(
        "Error",
        "Could not update the property status."
      );

      return;
    }

    setProperty({
      ...property,
      is_sold: !property.is_sold,
    });
  };

  const deleteProperty = () => {
    if (!property) return;

    Alert.alert(
      "Delete Property",
      "Are you sure you want to permanently delete this property?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    if (!property) return;

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", property.id);

    if (error) {
      console.log("DELETE ERROR:", error);

      Alert.alert(
        "Error",
        "Could not delete this property."
      );

      return;
    }

    Alert.alert(
      "Deleted",
      "Property has been deleted.",
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
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
          Loading property...
        </Text>
      </SafeAreaView>
    );
  }

  if (!property) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#111827",
          }}
        >
          Property not found
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginTop: 20,
            backgroundColor: "#2563EB",
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontWeight: "bold",
            }}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const images = property.images ?? [];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F9FAFB",
      }}
    >
      <View
        style={{
          height: 58,
          backgroundColor: "#FFFFFF",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            paddingRight: 20,
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              fontSize: 32,
              color: "#111827",
            }}
          >
            ‹
          </Text>
        </TouchableOpacity>

        <Text
          numberOfLines={1}
          style={{
            flex: 1,
            fontSize: 18,
            fontWeight: "bold",
            color: "#111827",
          }}
        >
          Property Details
        </Text>

        <TouchableOpacity
          onPress={toggleSave}
          disabled={saving}
          style={{
            padding: 8,
          }}
        >
          <Text style={{ fontSize: 25 }}>
            {saved ? "❤️" : "🤍"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View>
          {images.length > 0 ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setViewerVisible(true)}
            >
              <Image
                source={{
                  uri: images[imageIndex],
                }}
                style={{
                  width: "100%",
                  height: 300,
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ) : (
            <View
              style={{
                height: 300,
                backgroundColor: "#E5E7EB",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>No images available</Text>
            </View>
          )}

          {images.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                position: "absolute",
                bottom: 10,
                left: 10,
                right: 10,
              }}
            >
              {images.map((image, index) => (
                <TouchableOpacity
                  key={image + index}
                  onPress={() => setImageIndex(index)}
                  style={{
                    marginRight: 8,
                    borderWidth:
                      index === imageIndex ? 3 : 0,
                    borderColor: "#FFFFFF",
                  }}
                >
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: 60,
                      height: 60,
                    }}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={{ padding: 18 }}>
          {property.is_sold && (
            <View
              style={{
                alignSelf: "flex-start",
                backgroundColor: "#DC2626",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 6,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontWeight: "bold",
                }}
              >
                SOLD
              </Text>
            </View>
          )}

          <Text
            style={{
              fontSize: 26,
              fontWeight: "bold",
              color: "#111827",
            }}
          >
            {property.title}
          </Text>

          <Text
            style={{
              marginTop: 8,
              fontSize: 22,
              fontWeight: "bold",
              color: "#2563EB",
            }}
          >
            ₹{property.price.toLocaleString("en-IN")}
          </Text>

          <Text
            style={{
              marginTop: 8,
              fontSize: 15,
              color: "#6B7280",
            }}
          >
            📍 {property.address}, {property.city}
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: 18,
              gap: 10,
            }}
          >
            <View
              style={{
                backgroundColor: "#FFFFFF",
                padding: 12,
                borderRadius: 8,
              }}
            >
              <Text>
                🛏 {property.bedrooms} Bedrooms
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "#FFFFFF",
                padding: 12,
                borderRadius: 8,
              }}
            >
              <Text>
                🛁 {property.bathrooms} Bathrooms
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "#FFFFFF",
                padding: 12,
                borderRadius: 8,
              }}
            >
              <Text>
                📐 {property.area_sqft} sqft
              </Text>
            </View>
          </View>

          <Text
            style={{
              marginTop: 24,
              fontSize: 20,
              fontWeight: "bold",
              color: "#111827",
            }}
          >
            Description
          </Text>

          <Text
            numberOfLines={readMore ? undefined : 4}
            style={{
              marginTop: 8,
              fontSize: 15,
              lineHeight: 23,
              color: "#4B5563",
            }}
          >
            {property.description}
          </Text>

          <TouchableOpacity
            onPress={() => setReadMore(!readMore)}
            style={{
              marginTop: 8,
            }}
          >
            <Text
              style={{
                color: "#2563EB",
                fontWeight: "bold",
              }}
            >
              {readMore ? "Read Less" : "Read More"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleSave}
            disabled={saving}
            style={{
              marginTop: 24,
              borderWidth: 1,
              borderColor: "#2563EB",
              padding: 14,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#2563EB",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {saving
                ? "Saving..."
                : saved
                ? "❤️ Remove from Saved"
                : "🤍 Save Property"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openLocation}
            style={{
              marginTop: 12,
              backgroundColor: "#111827",
              padding: 14,
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
              📍 Open Location in Maps
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setContactVisible(true)}
            style={{
              marginTop: 12,
              backgroundColor: "#2563EB",
              padding: 14,
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
              📞 Contact Admin
            </Text>
          </TouchableOpacity>

          {isAdmin && (
            <View style={{ marginTop: 30 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                Admin Controls
              </Text>

              <TouchableOpacity
                onPress={markSold}
                style={{
                  backgroundColor: property.is_sold
                    ? "#16A34A"
                    : "#F59E0B",
                  padding: 14,
                  borderRadius: 8,
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontWeight: "bold",
                  }}
                >
                  {property.is_sold
                    ? "Mark as Available"
                    : "Mark as Sold"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={deleteProperty}
                style={{
                  backgroundColor: "#DC2626",
                  padding: 14,
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontWeight: "bold",
                  }}
                >
                  Delete Property
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={viewerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setViewerVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => setViewerVisible(false)}
            style={{
              position: "absolute",
              top: 50,
              right: 20,
              zIndex: 10,
              padding: 10,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 28,
              }}
            >
              ✕
            </Text>
          </TouchableOpacity>

          {images.length > 0 && (
            <Image
              source={{
                uri: images[imageIndex],
              }}
              style={{
                width: "100%",
                height: "70%",
              }}
              resizeMode="contain"
            />
          )}

          <Text
            style={{
              color: "#FFFFFF",
              textAlign: "center",
              marginTop: 20,
            }}
          >
            {imageIndex + 1} / {images.length}
          </Text>
        </View>
      </Modal>

      <Modal
        visible={contactVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setContactVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: "#111827",
              }}
            >
              Contact Admin
            </Text>

            <Text
              style={{
                marginTop: 6,
                color: "#6B7280",
              }}
            >
              Enquire about {property.title}
            </Text>

            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Write your message..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              style={{
                marginTop: 18,
                height: 120,
                borderWidth: 1,
                borderColor: "#D1D5DB",
                borderRadius: 10,
                padding: 12,
                fontSize: 15,
              }}
            />

            <TouchableOpacity
              onPress={contactAdmin}
              style={{
                marginTop: 14,
                backgroundColor: "#2563EB",
                padding: 14,
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
                Send Enquiry
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setContactVisible(false)}
              style={{
                marginTop: 10,
                padding: 14,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#6B7280",
                  fontWeight: "bold",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}