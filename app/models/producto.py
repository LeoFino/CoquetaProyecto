from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Producto(Base):
    __tablename__ = "productos"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(100))
    descripcion: Mapped[str | None] = mapped_column(String(300))
    precio: Mapped[float] = mapped_column(Float)
    disponible: Mapped[bool] = mapped_column(default=True)
    tiempo_preparacion: Mapped[int | None] = mapped_column(Integer)  # minutos
