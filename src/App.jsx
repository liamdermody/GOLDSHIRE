import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

const Home = () => <h1>Home</h1>
const Products = () => <h1>Products</h1>

export default function App() {
  return (
    <main style={{ padding: 24 }}>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </main>
  )
}
