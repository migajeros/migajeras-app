import dynamic from 'next/dynamic'

export default dynamic(
  () => import('../components/MigajerasPage'),
  { ssr: false }
)
