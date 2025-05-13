// pages/_app.js
import '../styles/globals.css'
import dynamic from 'next/dynamic'
import Layout from '../components/Layout'

const ThirdwebProviderNoSSR = dynamic(
  () => import('@thirdweb-dev/react').then(m => m.ThirdwebProvider),
  { ssr: false }
)

export default function App({ Component, pageProps }) {
  return (
    <ThirdwebProviderNoSSR desiredChainId={1}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThirdwebProviderNoSSR>
  )
}
