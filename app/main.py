from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models  # noqa: F401  (registra los modelos)
from app.database import Base, engine
from app.routers import pedidos, productos

# Crea las tablas si no existen (suficiente para esta etapa)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="La Coqueta API")

# Permite que el frontend de Vite (puerto 5173) llame al backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(productos.router)
app.include_router(pedidos.router)


@app.get("/")
def raiz():
    return {"servicio": "La Coqueta API", "estado": "ok"}
