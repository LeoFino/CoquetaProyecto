from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.pedido import EstadoPedido


class DetalleCreate(BaseModel):
    producto_id: int
    cantidad: int = Field(gt=0)
    observaciones: str | None = None


class PedidoCreate(BaseModel):
    cliente_nombre: str = Field(min_length=1, max_length=100)
    cliente_telefono: str | None = None
    canal_origen: str = "mostrador"
    modalidad_entrega: str = "retiro"
    direccion_entrega: str | None = None
    observaciones: str | None = None
    fecha_programada: datetime | None = None
    detalles: list[DetalleCreate] = Field(min_length=1)


class DetalleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    producto_id: int
    cantidad: int
    precio_unitario: float
    subtotal: float
    observaciones: str | None


class PedidoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    cliente_nombre: str
    cliente_telefono: str | None
    fecha_hora: datetime
    canal_origen: str
    modalidad_entrega: str
    direccion_entrega: str | None
    estado: EstadoPedido
    importe_total: float
    observaciones: str | None
    fecha_programada: datetime | None
    detalles: list[DetalleOut]
