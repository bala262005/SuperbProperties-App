
import { useSignIn } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const { isLoaded, signIn, setActive } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      await setActive({
        session: result.createdSessionId,
      });
    } catch (err: any) {
      console.log("Sign in error:", err);

      Alert.alert(
        "Sign In Failed",
        err?.errors?.[0]?.message || "Something went wrong"
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ padding: 24 }}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: "#111827",
          }}
        >
          Welcome To SuperbProperties
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            color: "#6B7280",
          }}
        >
          Sign in to continue
        </Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            marginTop: 24,
            borderWidth: 1,
            borderColor: "#D1D5DB",
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
          }}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            marginTop: 12,
            borderWidth: 1,
            borderColor: "#D1D5DB",
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
          }}
        />

        <TouchableOpacity
          onPress={handleSignIn}
          style={{
            marginTop: 20,
            backgroundColor: "#2563EB",
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
            Sign In
          </Text>
        </TouchableOpacity>

        <Link href={"/(root)/sign-up" as any} asChild>
          <TouchableOpacity
            style={{
              marginTop: 16,
              padding: 14,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#2563EB",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#2563EB",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Create an Account
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

