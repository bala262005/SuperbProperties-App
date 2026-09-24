import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900">
          Search
        </Text>

        <Text className="mt-4 text-gray-600">
          Search for properties here
        </Text>
      </View>
    </SafeAreaView>
  );
}