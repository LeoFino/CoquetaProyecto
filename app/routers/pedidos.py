from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.pedido import EstadoPedido
from app.schemas.pedido import PedidoCreate, PedidoOut
from app.services import pedido_service

router = APIRouter(prefix="/pedidos", tags=["pedidos"])


@router.post("", response_model=PedidoOut, status_code=201)
def crear_pedido(datos: PedidoCreate, db: Session = Depends(get_db)):
    try:
        return pedido_service.crear_pedido(db, datos)
    except pedido_service.ProductoInvalido as error:
        raise HTTPException(status_code=422, detail=str(error))


@router.get("", response_model=list[PedidoOut])
def listar_pedidos(estado: EstadoPedido | None = None, db: Session = Depends(get_db)):
    return pedido_service.listar_pedidos(db, estado)
