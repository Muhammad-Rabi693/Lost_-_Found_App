import { useAuth } from "@clerk/clerk-expo";
import "../../global.css";
import { Redirect, Stack } from "expo-router";
const RootLayout = () => {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href={'../(screens)/Home'} />
  }npm 
  return (
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name="Signin" />
      <Stack.Screen name="Signup" />
    </Stack>
  );
};
export default RootLayout;