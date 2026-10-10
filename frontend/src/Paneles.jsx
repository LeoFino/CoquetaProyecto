import { useState } from 'react'

const money = (n) => '$' + Math.round(n).toLocaleString('es-AR')

// Costo de UNA unidad = suma de (cantidad de cada insumo × su costo actual)
const costoProducto = (p, insumos) =>
  p.receta.reduce((t, r) => t + r.cant * insumos.find((i) => i.id === r.insumo).costo, 0)

const hoy = () => new Date().toLocaleString('es-AR')

export function Ventas({ user, insumos, setInsumos, productos, ventas, setVentas }) {
  const [prodId, setProdId] = useState(productos[0].id)
  const [cant, setCant] = useState(1)
  const [msg, setMsg] = useState('')
  const esAdmin = user.rol === 'admin'

  const vender = () => {
    const p = productos.find((x) => x.id === Number(prodId))
    const n = Number(cant)
    if (n < 1) return
    // 1) ¿alcanza el stock de TODOS los ingredientes?
    const falta = p.receta.find((r) => insumos.find((i) => i.id === r.insumo).stock < r.cant * n)
    if (falta) {
      return setMsg('❌ No alcanza el stock de ' + insumos.find((i) => i.id === falta.insumo).nombre)
    }
    // 2) Guardamos el costo de ESTE momento (los costos cambian con las compras)
    const costo = costoProducto(p, insumos) * n
    // 3) Descontamos los ingredientes del stock
    setInsumos(insumos.map((i) => {
      const r = p.receta.find((x) => x.insumo === i.id)
      return r ? { ...i, stock: i.stock - r.cant * n } : i
    }))
    setVentas([{ id: Date.now(), fecha: hoy(), producto: p.nombre, cant: n, ingreso: p.precio * n, costo }, ...ventas])
    setMsg('✔ Venta registrada: ' + n + ' × ' + p.nombre)
  }

  return (
    <>
      <div className="card">
        <h2>Registrar venta</h2>
        <div className="row">
          <select value={prodId} onChange={(e) => setProdId(e.target.value)}>
            {productos.map((p) => <option key={p.id} value={p.id}>{p.nombre} — {money(p.precio)}</option>)}
          </select>
          <input type="number" min="1" value={cant} onChange={(e) => setCant(e.target.value)} />
          <button onClick={vender}>Vender</button>
        </div>
        {msg && <p className="msg">{msg}</p>}
      </div>
      <div className="card">
        <h2>Últimas ventas</h2>
        {ventas.length === 0 ? <p className="chico">Todavía no hay ventas.</p> : (
          <div className="tabla"><table>
            <thead><tr><th>Fecha</th><th>Producto</th><th>Cant.</th><th>Total</th>
              {esAdmin && <><th>Costo</th><th>Ganancia</th></>}</tr></thead>
            <tbody>
              {ventas.slice(0, 10).map((v) => (
                <tr key={v.id}>
                  <td>{v.fecha}</td><td>{v.producto}</td><td>{v.cant}</td><td>{money(v.ingreso)}</td>
                  {esAdmin && <><td>{money(v.costo)}</td><td>{money(v.ingreso - v.costo)}</td></>}
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </div>
    </>
  )
}

export function Compras({ insumos, setInsumos, compras, setCompras }) {
  const [id, setId] = useState(insumos[0].id)
  const [cant, setCant] = useState('')
  const [total, setTotal] = useState('')

  const registrar = () => {
    const c = Number(cant)
    const t = Number(total)
    if (c <= 0 || t <= 0) return
    const ins = insumos.find((i) => i.id === Number(id))
    // Costo promedio: mezcla lo que ya había con lo que acabamos de comprar
    const nuevoCosto = (ins.stock * ins.costo + t) / (ins.stock + c)
    setInsumos(insumos.map((i) => (i.id === ins.id ? { ...i, stock: i.stock + c, costo: nuevoCosto } : i)))
    setCompras([{ id: Date.now(), fecha: hoy(), insumo: ins.nombre + ' (' + ins.unidad + ')', cant: c, total: t }, ...compras])
    setCant('')
    setTotal('')
  }

  return (
    <>
      <div className="card">
        <h2>Registrar compra</h2>
        <div className="row">
          <select value={id} onChange={(e) => setId(e.target.value)}>
            {insumos.map((i) => <option key={i.id} value={i.id}>{i.nombre} ({i.unidad})</option>)}
          </select>
          <input type="number" placeholder="Cantidad" value={cant} onChange={(e) => setCant(e.target.value)} />
          <input type="number" placeholder="Total pagado $" value={total} onChange={(e) => setTotal(e.target.value)} />
          <button onClick={registrar}>Guardar compra</button>
        </div>
      </div>
      <div className="card">
        <h2>Compras registradas</h2>
        {compras.length === 0 ? <p className="chico">Todavía no hay compras.</p> : (
          <div className="tabla"><table>
            <thead><tr><th>Fecha</th><th>Insumo</th><th>Cantidad</th><th>Total</th></tr></thead>
            <tbody>
              {compras.map((c) => (
                <tr key={c.id}><td>{c.fecha}</td><td>{c.insumo}</td><td>{c.cant}</td><td>{money(c.total)}</td></tr>
              ))}
            </tbody>
          </table></div>
        )}
      </div>
    </>
  )
}

export function Stock({ insumos }) {
  return (
    <div className="card">
      <h2>Stock de insumos</h2>
      <div className="tabla"><table>
        <thead><tr><th>Insumo</th><th>Stock</th><th>Estado</th></tr></thead>
        <tbody>
          {insumos.map((i) => (
            <tr key={i.id}>
              <td>{i.nombre}</td><td>{i.stock} {i.unidad}</td>
              <td><span className={'badge ' + (i.stock <= i.min ? 'mal' : 'ok')}>{i.stock <= i.min ? 'Stock bajo' : 'OK'}</span></td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
  )
}

export function Costos({ insumos, productos, setProductos }) {
  const cambiarPrecio = (id, precio) =>
    setProductos(productos.map((p) => (p.id === id ? { ...p, precio: Number(precio) } : p)))

  return (
    <div className="card">
      <h2>Costo exacto y precio de venta</h2>
      <div className="tabla"><table>
        <thead><tr><th>Producto</th><th>Receta</th><th>Costo</th><th>Precio</th><th>Ganancia</th><th>Margen</th></tr></thead>
        <tbody>
          {productos.map((p) => {
            const costo = costoProducto(p, insumos)
            const ganancia = p.precio - costo
            const margen = p.precio ? (ganancia / p.precio) * 100 : 0
            const estado = margen < 0 ? ['mal', 'PÉRDIDA'] : margen < 30 ? ['', 'Margen bajo'] : ['ok', 'OK']
            return (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td className="chico">
                  {p.receta.map((r) => {
                    const i = insumos.find((x) => x.id === r.insumo)
                    return r.cant + i.unidad + ' ' + i.nombre
                  }).join(' + ')}
                </td>
                <td>{money(costo)}</td>
                <td><input type="number" value={p.precio} onChange={(e) => cambiarPrecio(p.id, e.target.value)} /></td>
                <td>{money(ganancia)}</td>
                <td>{margen.toFixed(0)}% <span className={'badge ' + estado[0]}>{estado[1]}</span></td>
              </tr>
            )
          })}
        </tbody>
      </table></div>
    </div>
  )
}

export function Resumen({ ventas, compras }) {
  const ingresos = ventas.reduce((t, v) => t + v.ingreso, 0)
  const costos = ventas.reduce((t, v) => t + v.costo, 0)
  const gastoCompras = compras.reduce((t, c) => t + c.total, 0)
  const ganancia = ingresos - costos
  const margen = ingresos ? (ganancia / ingresos) * 100 : 0
  const datos = [
    ['Ventas', money(ingresos)], ['Costo de lo vendido', money(costos)],
    ['Ganancia', money(ganancia)], ['Margen', margen.toFixed(0) + '%'],
    ['Gastado en compras', money(gastoCompras)],
  ]
  return (
    <div className="kpis">
      {datos.map(([titulo, valor]) => (
        <div className="card kpi" key={titulo}><small>{titulo}</small><strong>{valor}</strong></div>
      ))}
    </div>
  )
}
