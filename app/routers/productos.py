from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.producto import Producto
from app.schemas.producto import ProductoCreate, ProductoOut

router = APIRouter(prefix="/productos", tags=["productos"])


@router.post("", response_model=ProductoOut, status_code=201)
def crear_producto(datos: ProductoCreate, db: Session = Depends(get_db)):
    producto = Producto(**datos.model_dump())
    db.add(producto)
    db.commit()
    db.refresh(producto)
    return producto


@router.get("", response_model=list[ProductoOut])
def listar_productos(db: Session = Depends(get_db)):
    return list(db.scalars(select(Producto).order_by(Producto.nombre)).all())
