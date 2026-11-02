import React from "react";
import { Redirect } from "expo-router";

// Root entry redirect to the (tabs)/home screen
export default function Index() {
  return <Redirect href="/(tabs)/home" />;
}