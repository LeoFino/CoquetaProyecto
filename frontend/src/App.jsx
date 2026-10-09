import './App.css'

// Los datos van arriba, separados del HTML. Más adelante
// estos valores van a venir del backend (Python).
const sprint = { nombre: 'Sprint 0 — Setup', hechas: 2, total: 6 }

const pedido = {
  mesa: 'Mesa 4',
  estado: 'En cocina',
  items: [
    { nombre: 'Milanesa napolitana', cantidad: 1 },
    { nombre: 'Ensalada mixta', cantidad: 1 },
    { nombre: 'Agua con gas', cantidad: 2 },
  ],
}

function App() {
  return (
    <>
      <header>
        <div className="brand">La Coqueta</div>
        <div className="status-pill">En construcción</div>
      </header>

      <main>
        <div className="hero-text">
          <div className="eyebrow">Sistema de pedidos &amp; cocina</div>
          <h1>
            Cada mesa,<br />
            <em>bajo control.</em>
          </h1>
          <p className="lede">
            Pedidos, cobro, stock y cocina en un solo lugar. Este es el punto de
            partida del frontend — a partir de acá se conecta con el backend y se
            arma cada pantalla.
          </p>

          <div className="progress-block">
            <h3>{sprint.nombre}</h3>
            <div className="track">
              {/* Genera una barrita por tarea; las primeras "hechas" quedan en dorado */}
              {Array.from({ length: sprint.total }, (_, i) => (
                <span key={i} className={i < sprint.hechas ? 'done' : ''}></span>
              ))}
            </div>
            <div className="track-label">
              <span>{sprint.hechas} de {sprint.total} tareas</span>
              <span>Leandro · Ezequiel · Gustavo</span>
            </div>
          </div>
        </div>

        <div className="visual">
          <div className="ticket">
            <div className="ticket-title">{pedido.mesa}</div>
            {pedido.items.map((item) => (
              <div className="ticket-row" key={item.nombre}>
                <span>{item.nombre}</span>
                <span>x{item.cantidad}</span>
              </div>
            ))}
            <div className="ticket-total">
              <span>Estado</span>
              <span>{pedido.estado}</span>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <span>La Coqueta — proyecto en desarrollo</span>
        <span>Frontend: Leandro · Backend: Gustavo · Testing: Ezequiel</span>
      </footer>
    </>
  )
}

export default App
