import { Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { signOut } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900">
          Profile
        </Text>

        <Text className="mt-4 text-gray-600">
          Welcome to your profile
        </Text>
        <TouchableOpacity
  onPress={() => signOut()}
  style={{
    marginTop: 24,
    backgroundColor: "#DC2626",
    padding: 14,
    borderRadius: 8,
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
    </SafeAreaView>
  );
}