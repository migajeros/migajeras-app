// pages/_app.js
import '../styles/globals.css'
import Layout from '../components/Layout'
import { ThirdwebProvider } from '@thirdweb-dev/react'

export default function App({ Component, pageProps }) {
  // Si estamos en el servidor, renderiza solo la página sin el provider
  if (typeof window === 'undefined') {
    return <Component {...pageProps} />
  }

  // En el cliente cargamos el provider normalmente
  return (
    <ThirdwebProvider desiredChainId={1}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThirdwebProvider>
  )
}
