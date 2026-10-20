# Importar los modelos aca hace que SQLAlchemy los registre
# antes de crear las tablas.
from app.models.pedido import DetallePedido, EstadoPedido, Pedido  # noqa: F401
from app.models.producto import Producto  # noqa: F401
