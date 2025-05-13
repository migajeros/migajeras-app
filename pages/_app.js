// pages/_app.js
import dynamic from 'next/dynamic'

// Carga el provider **solo en cliente** (no SSR)
const ThirdwebProviderNoSSR = dynamic(
  () => import('@thirdweb-dev/react').then(mod => mod.ThirdwebProvider),
  { ssr: false }
)

export default function App({ Component, pageProps }) {
  return (
    <ThirdwebProviderNoSSR desiredChainId={1 /* ChainId.Mainnet */}>
      <Component {...pageProps} />
    </ThirdwebProviderNoSSR>
  )
}
