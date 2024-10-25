import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = {
  config: {
    initialColorMode: "dark", // ダークモードをデフォルトに設定
    useSystemColorMode: false, // OSの設定を使わせない
  },
};
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ChakraProvider theme={extendTheme(theme)}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}
