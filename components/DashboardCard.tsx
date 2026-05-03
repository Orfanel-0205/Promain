// components/DashboardCard.tsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type DashboardCardProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
  color?: string;
};

export function DashboardCard({
  iconName,
  title,
  description,
  onPress,
  color = "#0D9488",
}: DashboardCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: color }]}>
        <Ionicons name={iconName} size={28} color="#fff" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#134E4A",
    textAlign: "center",
    marginBottom: 4,
  },
  description: {
    fontSize: 11,
    color: "#0F766E",
    textAlign: "center",
    lineHeight: 16,
  },
});
