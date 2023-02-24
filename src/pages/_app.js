import "../index.css";
import { useMuiTheme } from "../theme/theme";
import { ThemeProvider, CssBaseline } from "@mui/material";
import Head from "next/head";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../lib/createEmotionCache";
import Layout from "../layout/Layout";
import { ProSidebarProvider } from "react-pro-sidebar";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRef } from "react";

// client-side cache, shared for the whole session of the user in the browser
const clientSideEmotionCache = createEmotionCache();

export default function App({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}) {
  const theme = useMuiTheme();
  const queryClient = useRef(new QueryClient());

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <ProSidebarProvider>
          <QueryClientProvider client={queryClient.current}>
            {
              // this is the important part, we are passing the dehydratedState to the Hydrate component and it will hydrate the cache on client
              // prefetched data will be available on the client side to every component that uses useQuery
            }
            <Hydrate state={pageProps.dehydratedState}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
              <ReactQueryDevtools initialIsOpen={false} />
            </Hydrate>
          </QueryClientProvider>
        </ProSidebarProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
