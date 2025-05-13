// components/Layout.js
import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <div>
      <nav style={{ padding: 16, background: '#e63946', color: '#fff' }}>
        <Link href="/"><a style={{ marginRight: 12 }}>Home</a></Link>
        <Link href="/migajeras"><a>Cuenta tu Migajera</a></Link>
      </nav>
      <main>{children}</main>
    </div>
  )
}
