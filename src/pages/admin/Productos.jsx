import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";

const API = "http://localhost:9001/api";

// ─────────────────────────────────────────────────────────────
// MODAL CREAR / EDITAR
// ─────────────────────────────────────────────────────────────
function ProductoModal({ categorias, producto, onClose, onSaved }) {
  const [form, setForm] = useState({
    categoriaId: "",
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagenUrl: "",
    activo: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ IMPORTANTE: sincroniza cuando cambia el producto
  useEffect(() => {
    setForm({
      categoriaId: producto?.categoriaId ?? "",
      nombre: producto?.nombre ?? "",
      descripcion: producto?.descripcion ?? "",
      precio: producto?.precio ?? "",
      stock: producto?.stock ?? "",
      imagenUrl: producto?.imagenUrl ?? "",
      activo: producto?.activo ?? true,
    });
  }, [producto]);

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = producto
        ? `${API}/productos/${producto.id}`
        : `${API}/productos`;

      const method = producto ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          categoriaId: Number(form.categoriaId),
          precio: parseFloat(form.precio),
          stock: parseInt(form.stock),
        }),
      });

      if (!res.ok) throw new Error();

      onSaved();
    } catch (err) {
      setError("Error al guardar el producto.");
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <h3>{producto ? "Editar producto" : "Nuevo producto"}</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Categoría</label>
            <select
              value={form.categoriaId}
              onChange={set("categoriaId")}
              required
            >
              <option value="">Seleccionar...</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Nombre</label>
            <input
              value={form.nombre}
              onChange={set("nombre")}
              required
            />
          </div>

          <div className="field">
            <label>Descripción</label>
            <input
              value={form.descripcion}
              onChange={set("descripcion")}
            />
          </div>

          <div className="grid-2">
            <div className="field">
              <label>Precio</label>
              <input
                type="number"
                step="0.01"
                value={form.precio}
                onChange={set("precio")}
                required
              />
            </div>

            <div className="field">
              <label>Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={set("stock")}
                required
              />
            </div>
          </div>

          <div className="field">
            <label>Imagen URL</label>
            <input
              value={form.imagenUrl}
              onChange={set("imagenUrl")}
            />
          </div>

          <div className="field">
            <label>Estado</label>
            <select
              value={form.activo}
              onChange={(e) =>
                setForm({ ...form, activo: e.target.value === "true" })
              }
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>

          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ─────────────────────────────────────────────────────────────
export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);

  const [msg, setMsg] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    setLoading(true);

    try {
      const [p, c] = await Promise.all([
        fetch(`${API}/productos`).then((r) => r.json()),
        fetch(`${API}/categorias`).then((r) => r.json()),
      ]);

      setProductos(
        p.map((prod) => ({
          ...prod,
          categoriaNombre: prod.categoria?.nombre || "Sin categoría",
        }))
      );

      setCategorias(c);
    } catch (e) {
      flash("error", "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }

  async function eliminar(id) {
    if (!confirm("¿Eliminar producto?")) return;

    await fetch(`${API}/productos/${id}`, {
      method: "DELETE",
    });

    flash("success", "Producto eliminado");
    cargar();
  }

  function flash(type, text) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  }

  function abrirNuevo() {
    setEditando(null);
    setModal(true);
  }

  function abrirEditar(p) {
    setEditando(p);
    setModal(true);
  }

  return (
    <AdminLayout title="Productos">
      <div className="page">
        {msg && (
          <div className={`alert alert-${msg.type}`}>{msg.text}</div>
        )}

        <div className="section-header">
          <h2>Productos</h2>
          <button className="btn btn-primary" onClick={abrirNuevo}>
            + Nuevo
          </button>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.categoriaNombre}</td>
                  <td>S/. {p.precio}</td>
                  <td>{p.stock}</td>
                  <td>{p.activo ? "Activo" : "Inactivo"}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => abrirEditar(p)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => eliminar(p.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {modal && (
          <ProductoModal
            categorias={categorias}
            producto={editando}
            onClose={() => setModal(false)}
            onSaved={() => {
              setModal(false);
              cargar();
              flash(
                "success",
                editando
                  ? "Producto actualizado"
                  : "Producto creado"
              );
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}