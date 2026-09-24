
import { useSignUp } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSignUp = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: email,
        password: password,
      });

      await signUp.prepareVerification({
        strategy: "email_code",
      });

      setVerificationSent(true);

      Alert.alert(
        "Verification Code Sent",
        "Check your email and enter the code."
      );
    } catch (err: any) {
      console.log("Sign up error:", err);

      Alert.alert(
        "Sign Up Failed",
        err?.errors?.[0]?.message || "Something went wrong"
      );
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        await setActive({
          session: result.createdSessionId,
        });
      } else {
        Alert.alert(
          "Verification Incomplete",
          "Please complete the verification."
        );
      }
    } catch (err: any) {
      console.log("Verification error:", err);

      Alert.alert(
        "Verification Failed",
        err?.errors?.[0]?.message || "Invalid verification code"
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ padding: 24 }}>
        <Image
  source={require("../../assets/images/logo.png")}
  style={{
    width: "100%",
    height: 180,
    resizeMode: "contain",
    marginBottom: 10,
  }}
/>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: "#111827",
          }}
        >
          Create Account
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            color: "#6B7280",
          }}
        >
          Sign up to continue
        </Text>

        {!verificationSent ? (
          <>
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
              onPress={handleSignUp}
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
                Sign Up
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text
              style={{
                marginTop: 24,
                fontSize: 16,
                color: "#374151",
              }}
            >
              Enter the verification code sent to your email:
            </Text>

            <TextInput
              placeholder="Verification Code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              style={{
                marginTop: 12,
                borderWidth: 1,
                borderColor: "#D1D5DB",
                borderRadius: 8,
                padding: 12,
                fontSize: 18,
              }}
            />

            <TouchableOpacity
              onPress={handleVerify}
              style={{
                marginTop: 20,
                backgroundColor: "#16A34A",
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
                Verify Email
              </Text>
            </TouchableOpacity>
          </>
        )}

        <Link href={"/(root)/sign-in" as any} asChild>
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
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}
