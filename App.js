import { useState } from "react";

function App() {
  const [items, setItems] = useState([{ nombre: "", unidad: "", cantidad: 0, precio: 0 }]);
  const [margen, setMargen] = useState(0);
  const [descuento, setDescuento] = useState(0);

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === "cantidad" || field === "precio" ? parseFloat(value) : value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { nombre: "", unidad: "", cantidad: 0, precio: 0 }]);
  };

  const subtotal = items.reduce((acc, item) => acc + item.cantidad * item.precio, 0);
  const totalConMargen = subtotal + (subtotal * (margen / 100));
  const totalFinal = totalConMargen - (totalConMargen * (descuento / 100));

  const handleExportPDF = () => {
    const doc = new window.jspdf.jsPDF();
    doc.setFontSize(12);
    doc.text("Cotización", 10, 10);
    let y = 20;
    items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.nombre} - ${item.unidad} - Cant: ${item.cantidad} - Precio: $${item.precio}`, 10, y);
      y += 10;
    });
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 10, y);
    y += 10;
    doc.text(`Margen ${margen}%: $${(subtotal * (margen / 100)).toFixed(2)}`, 10, y);
    y += 10;
    doc.text(`Descuento ${descuento}%: $${(totalConMargen * (descuento / 100)).toFixed(2)}`, 10, y);
    y += 10;
    doc.text(`Total Final: $${totalFinal.toFixed(2)}`, 10, y);
    doc.save("cotizacion.pdf");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Cotizador Universal</h1>
      {items.map((item, index) => (
        <div key={index} style={{ marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
          <input
            placeholder="Nombre del ítem"
            value={item.nombre}
            onChange={(e) => handleChange(index, "nombre", e.target.value)}
            style={{ display: "block", marginBottom: "5px", width: "100%" }}
          />
          <input
            placeholder="Unidad (mt, un, caja)"
            value={item.unidad}
            onChange={(e) => handleChange(index, "unidad", e.target.value)}
            style={{ display: "block", marginBottom: "5px", width: "100%" }}
          />
          <input
            placeholder="Cantidad"
            type="number"
            value={item.cantidad}
            onChange={(e) => handleChange(index, "cantidad", e.target.value)}
            style={{ display: "block", marginBottom: "5px", width: "100%" }}
          />
          <input
            placeholder="Precio unitario"
            type="number"
            value={item.precio}
            onChange={(e) => handleChange(index, "precio", e.target.value)}
            style={{ display: "block", marginBottom: "5px", width: "100%" }}
          />
        </div>
      ))}
      <button onClick={handleAddItem}>Agregar ítem</button>
      <div style={{ marginTop: "20px" }}>
        <input
          type="number"
          placeholder="Margen (%)"
          value={margen}
          onChange={(e) => setMargen(parseFloat(e.target.value))}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <input
          type="number"
          placeholder="Descuento (%)"
          value={descuento}
          onChange={(e) => setDescuento(parseFloat(e.target.value))}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Total con margen: ${totalConMargen.toFixed(2)}</p>
        <p>Total con descuento: ${totalFinal.toFixed(2)}</p>
        <button onClick={handleExportPDF}>Generar PDF</button>
      </div>
    </div>
  );
}

export default App;