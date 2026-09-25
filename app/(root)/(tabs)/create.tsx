
import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useUserStore } from "@/store/userStore";

export default function Create() {
  const isAdmin = useUserStore((state) => state.isAdmin);

  // Non-admin users are sent back to Home
  if (!isAdmin) {
    return <Redirect href="/(root)/(tabs)" />;
  }

  // Admin users can see this screen
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900">
          Add Property
        </Text>

        <Text className="mt-4 text-gray-600">
          Your saved properties will appear here
        </Text>
      </View>
    </SafeAreaView>
  );
}

