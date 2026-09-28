import { useAuth, useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [profileImage, setProfileImage] = useState<string | null>(
    user?.imageUrl ?? null
  );

  const openImageOptions = () => {
    Alert.alert(
      "Profile Picture",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: openCamera,
        },
        {
          text: "Gallery",
          onPress: openGallery,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const openCamera = async () => {
    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Camera Permission",
        "Please allow camera access in your phone settings."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Gallery Permission",
        "Please allow photo access in your phone settings."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log("SIGN OUT ERROR:", error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8FAFC",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
      >
        {/* Header */}
        <View
          style={{
            backgroundColor: "#86580f",
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 35,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 26,
              fontWeight: "bold",
              marginBottom: 20,
            }}
          >
            Profile
          </Text>

          {/* Profile Picture */}
          <TouchableOpacity
            onPress={openImageOptions}
            activeOpacity={0.8}
          >
            <View
              style={{
                width: 110,
                height: 110,
                borderRadius: 55,
                backgroundColor: "#FFFFFF",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                borderWidth: 4,
                borderColor: "#FFFFFF",
              }}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              ) : (
                <Text
                  style={{
                    fontSize: 45,
                  }}
                >
                  👤
                </Text>
              )}
            </View>

            {/* Camera button */}
            <View
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: "#111827",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 3,
                borderColor: "#FFFFFF",
              }}
            >
              <Text style={{ fontSize: 17 }}>📷</Text>
            </View>
          </TouchableOpacity>

          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 21,
              fontWeight: "bold",
              marginTop: 14,
            }}
          >
            {user?.fullName || "User"}
          </Text>

          <Text
            style={{
              color: "#DBEAFE",
              fontSize: 14,
              marginTop: 4,
            }}
          >
            {user?.primaryEmailAddress?.emailAddress || ""}
          </Text>
        </View>

        {/* Account section */}
        <View
          style={{
            paddingHorizontal: 16,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "#6B7280",
              marginBottom: 8,
              marginLeft: 4,
            }}
          >
            ACCOUNT
          </Text>

          {/* Saved Properties */}
          <TouchableOpacity
            onPress={() => router.push("/(root)/(tabs)/saved")}
            activeOpacity={0.7}
            style={{
              backgroundColor: "#FFFFFF",
              padding: 18,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "#FEE2E2",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 22 }}>❤️</Text>
            </View>

            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#111827",
                }}
              >
                Saved Properties
              </Text>

              <Text
                style={{
                  marginTop: 3,
                  color: "#6B7280",
                  fontSize: 13,
                }}
              >
                View properties you saved
              </Text>
            </View>

            <Text
              style={{
                fontSize: 24,
                color: "#9CA3AF",
              }}
            >
              ›
            </Text>
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              backgroundColor: "#FFFFFF",
              padding: 18,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "#FEF3C7",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 22 }}>🔔</Text>
            </View>

            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#111827",
                }}
              >
                Notifications
              </Text>

              <Text
                style={{
                  marginTop: 3,
                  color: "#6B7280",
                  fontSize: 13,
                }}
              >
                Manage your notifications
              </Text>
            </View>

            <Text
              style={{
                fontSize: 24,
                color: "#9CA3AF",
              }}
            >
              ›
            </Text>
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              backgroundColor: "#FFFFFF",
              padding: 18,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "#E0E7FF",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 22 }}>⚙️</Text>
            </View>

            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#111827",
                }}
              >
                Settings
              </Text>

              <Text
                style={{
                  marginTop: 3,
                  color: "#6B7280",
                  fontSize: 13,
                }}
              >
                App and account settings
              </Text>
            </View>

            <Text
              style={{
                fontSize: 24,
                color: "#9CA3AF",
              }}
            >
              ›
            </Text>
          </TouchableOpacity>

          {/* Help & Support */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              backgroundColor: "#FFFFFF",
              padding: 18,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "#DCFCE7",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 22 }}>🆘</Text>
            </View>

            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#111827",
                }}
              >
                Help & Support
              </Text>

              <Text
                style={{
                  marginTop: 3,
                  color: "#6B7280",
                  fontSize: 13,
                }}
              >
                Get help with SuperbProperties
              </Text>
            </View>

            <Text
              style={{
                fontSize: 24,
                color: "#9CA3AF",
              }}
            >
              ›
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign out */}
        <View
          style={{
            paddingHorizontal: 16,
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={handleSignOut}
            activeOpacity={0.8}
            style={{
              backgroundColor: "#DC2626",
              paddingVertical: 15,
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
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            textAlign: "center",
            color: "#9CA3AF",
            fontSize: 12,
            marginTop: 20,
          }}
        >
          SuperbProperties
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}