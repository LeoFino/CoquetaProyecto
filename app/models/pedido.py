import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.producto import Producto


class EstadoPedido(str, enum.Enum):
    REGISTRADO = "registrado"
    CONFIRMADO = "confirmado"
    EN_PREPARACION = "en_preparacion"
    LISTO = "listo"
    ENTREGADO = "entregado"
    CANCELADO = "cancelado"


class Pedido(Base):
    __tablename__ = "pedidos"

    id: Mapped[int] = mapped_column(primary_key=True)
    cliente_nombre: Mapped[str] = mapped_column(String(100))
    cliente_telefono: Mapped[str | None] = mapped_column(String(30))
    fecha_hora: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    canal_origen: Mapped[str] = mapped_column(String(30), default="mostrador")
    modalidad_entrega: Mapped[str] = mapped_column(String(30), default="retiro")
    direccion_entrega: Mapped[str | None] = mapped_column(String(200))
    estado: Mapped[EstadoPedido] = mapped_column(
        Enum(EstadoPedido), default=EstadoPedido.REGISTRADO
    )
    importe_total: Mapped[float] = mapped_column(Float, default=0)
    observaciones: Mapped[str | None] = mapped_column(String(300))
    fecha_programada: Mapped[datetime | None] = mapped_column(DateTime)
    motivo_cancelacion: Mapped[str | None] = mapped_column(String(300))

    detalles: Mapped[list["DetallePedido"]] = relationship(
        back_populates="pedido", cascade="all, delete-orphan"
    )


class DetallePedido(Base):
    __tablename__ = "detalles_pedido"

    id: Mapped[int] = mapped_column(primary_key=True)
    pedido_id: Mapped[int] = mapped_column(ForeignKey("pedidos.id"))
    producto_id: Mapped[int] = mapped_column(ForeignKey("productos.id"))
    cantidad: Mapped[int] = mapped_column(Integer)
    precio_unitario: Mapped[float] = mapped_column(Float)
    subtotal: Mapped[float] = mapped_column(Float)
    observaciones: Mapped[str | None] = mapped_column(String(300))

    pedido: Mapped["Pedido"] = relationship(back_populates="detalles")
    producto: Mapped["Producto"] = relationship()
