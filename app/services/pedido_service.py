from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.pedido import DetallePedido, EstadoPedido, Pedido
from app.models.producto import Producto
from app.schemas.pedido import PedidoCreate


class ProductoInvalido(Exception):
    """El producto no existe o no esta disponible."""


def crear_pedido(db: Session, datos: PedidoCreate) -> Pedido:
    detalles = []
    for item in datos.detalles:
        producto = db.get(Producto, item.producto_id)
        if producto is None or not producto.disponible:
            raise ProductoInvalido(
                f"El producto {item.producto_id} no existe o no esta disponible"
            )
        # El precio lo toma el servidor del catalogo, no lo manda el cliente
        detalles.append(
            DetallePedido(
                producto_id=producto.id,
                cantidad=item.cantidad,
                precio_unitario=producto.precio,
                subtotal=producto.precio * item.cantidad,
                observaciones=item.observaciones,
            )
        )

    pedido = Pedido(
        cliente_nombre=datos.cliente_nombre,
        cliente_telefono=datos.cliente_telefono,
        canal_origen=datos.canal_origen,
        modalidad_entrega=datos.modalidad_entrega,
        direccion_entrega=datos.direccion_entrega,
        observaciones=datos.observaciones,
        fecha_programada=datos.fecha_programada,
        estado=EstadoPedido.REGISTRADO,
        detalles=detalles,
        importe_total=sum(d.subtotal for d in detalles),
    )
    db.add(pedido)
    db.commit()
    db.refresh(pedido)
    return pedido


def listar_pedidos(db: Session, estado: EstadoPedido | None = None) -> list[Pedido]:
    consulta = select(Pedido).order_by(Pedido.id.desc())
    if estado is not None:
        consulta = consulta.where(Pedido.estado == estado)
    return list(db.scalars(consulta).all())
