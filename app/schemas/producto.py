from pydantic import BaseModel, ConfigDict, Field


class ProductoCreate(BaseModel):
    nombre: str = Field(min_length=1, max_length=100)
    descripcion: str | None = None
    precio: float = Field(ge=0)
    disponible: bool = True
    tiempo_preparacion: int | None = Field(default=None, ge=0)


class ProductoOut(ProductoCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
