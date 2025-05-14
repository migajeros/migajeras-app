// pages/_app.js
import '../styles/globals.css'
import dynamic from 'next/dynamic'
import Layout from '../components/Layout'

// Cargamos el ThirdwebProvider sin SSR
const ThirdwebProviderNoSSR = dynamic(
  () => import('@thirdweb-dev/react').then(m => m.ThirdwebProvider),
  { ssr: false }
)

export default function App({ Component, pageProps }) {
  // AQUÍ PONES EL CONSOLE.LOG:
  console.log("Intentando usar Client ID en _app.js (desde Vercel):", process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID);

  return (
    // Le pasamos el clientId público y la cadena deseada
    <ThirdwebProviderNoSSR
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      desiredChainId={1} // Ethereum Mainnet
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThirdwebProviderNoSSR>
  )
}