import { useState } from 'react'
import './App.css'
import { Resumen, Ventas, Compras, Stock, Costos } from './Paneles.jsx'

// ⚠️ Usuarios de PRUEBA. El login real lo tiene que hacer el backend (Python).
const USUARIOS = [
  { usuario: 'admin', clave: 'admin123', rol: 'admin', nombre: 'Jefe' },
  { usuario: 'empleado', clave: '1234', rol: 'empleado', nombre: 'Empleado' },
]

// Insumos = lo que compramos. "costo" es el costo por unidad (u) o por gramo (g).
const INSUMOS_INICIAL = [
  { id: 1, nombre: 'Pan de lomito', unidad: 'u', stock: 20, costo: 300, min: 6 },
  { id: 2, nombre: 'Carne de lomo', unidad: 'g', stock: 3000, costo: 9, min: 600 },
  { id: 3, nombre: 'Jamón', unidad: 'g', stock: 600, costo: 12, min: 150 },
  { id: 4, nombre: 'Queso', unidad: 'g', stock: 600, costo: 10, min: 150 },
  { id: 5, nombre: 'Huevo', unidad: 'u', stock: 24, costo: 250, min: 6 },
  { id: 6, nombre: 'Lechuga', unidad: 'g', stock: 400, costo: 3, min: 100 },
  { id: 7, nombre: 'Tomate', unidad: 'g', stock: 600, costo: 3, min: 150 },
]

// Productos = lo que vendemos. La receta dice cuánto de cada insumo lleva UNO.
const PRODUCTOS_INICIAL = [
  {
    id: 1, nombre: 'Lomito completo', precio: 6500,
    receta: [
      { insumo: 1, cant: 1 }, { insumo: 2, cant: 150 }, { insumo: 3, cant: 30 },
      { insumo: 4, cant: 30 }, { insumo: 5, cant: 1 }, { insumo: 6, cant: 20 },
      { insumo: 7, cant: 30 },
    ],
  },
  {
    id: 2, nombre: 'Sándwich de jamón y queso', precio: 3200,
    receta: [{ insumo: 1, cant: 1 }, { insumo: 3, cant: 40 }, { insumo: 4, cant: 40 }],
  },
]

const SECCIONES = {
  resumen: 'Resumen', ventas: 'Ventas', compras: 'Compras',
  stock: 'Stock', costos: 'Costos y precios',
}

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')

  const entrar = (e) => {
    e.preventDefault()
    const u = USUARIOS.find((x) => x.usuario === usuario && x.clave === clave)
    if (u) onLogin(u)
    else setError('Usuario o clave incorrectos')
  }

  return (
    <main className="login">
      <form className="card" onSubmit={entrar}>
        <div className="brand">La Coqueta</div>
        <input placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
        <input type="password" placeholder="Clave" value={clave} onChange={(e) => setClave(e.target.value)} />
        <button type="submit">Ingresar</button>
        {error && <p className="error">{error}</p>}
        <p className="chico">Prueba: admin / admin123 · empleado / 1234</p>
      </form>
    </main>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState('ventas')
  const [insumos, setInsumos] = useState(INSUMOS_INICIAL)
  const [productos, setProductos] = useState(PRODUCTOS_INICIAL)
  const [ventas, setVentas] = useState([])
  const [compras, setCompras] = useState([])

  if (!user) {
    return <Login onLogin={(u) => { setUser(u); setTab(u.rol === 'admin' ? 'resumen' : 'ventas') }} />
  }

  // El empleado solo ve Ventas y Stock; el jefe ve todo.
  const secciones = user.rol === 'admin' ? Object.keys(SECCIONES) : ['ventas', 'stock']
  const datos = { user, insumos, setInsumos, productos, setProductos, ventas, setVentas, compras, setCompras }

  return (
    <>
      <header>
        <div className="brand">La Coqueta</div>
        <div className="who">
          <span className="status-pill">{user.nombre} · {user.rol}</span>
          <button className="link" onClick={() => setUser(null)}>Salir</button>
        </div>
      </header>
      <nav>
        {secciones.map((s) => (
          <button key={s} className={s === tab ? 'on' : ''} onClick={() => setTab(s)}>{SECCIONES[s]}</button>
        ))}
      </nav>
      <main>
        {tab === 'resumen' && <Resumen {...datos} />}
        {tab === 'ventas' && <Ventas {...datos} />}
        {tab === 'compras' && <Compras {...datos} />}
        {tab === 'stock' && <Stock {...datos} />}
        {tab === 'costos' && <Costos {...datos} />}
      </main>
    </>
  )
}

export default App
