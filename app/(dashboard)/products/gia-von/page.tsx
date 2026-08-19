const COSTS = [
  { sku: "USA-R01", name: "Gạo ST25 túi 5kg", unit: "Túi", cost: "86.000đ", updated: "18/03/2026" },
  { sku: "USA-C02", name: "Cà phê Arabica 1kg", unit: "Kg", cost: "145.000đ", updated: "17/03/2026" },
  { sku: "USA-T03", name: "Trà ô long hộp 200g", unit: "Hộp", cost: "52.000đ", updated: "16/03/2026" },
  { sku: "USA-M04", name: "Mật ong rừng 500ml", unit: "Chai", cost: "118.000đ", updated: "15/03/2026" },
  { sku: "USA-D05", name: "Đậu xanh nguyên hạt 1kg", unit: "Kg", cost: "34.000đ", updated: "14/03/2026" },
];

export default function CostPricePage() {
  return (
    <>
      <header className="admin-page-header">
        <h1>Quản lý giá vốn</h1>
        <input className="admin-search" type="search" placeholder="Tìm sản phẩm, SKU" />
      </header>

      <article className="admin-card">
        <div className="admin-card__head">
          <h2>Bảng giá vốn sản phẩm</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Sản phẩm</th>
              <th>Đơn vị</th>
              <th>Giá vốn</th>
              <th>Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {COSTS.map((row) => (
              <tr key={row.sku}>
                <td>{row.sku}</td>
                <td>{row.name}</td>
                <td>{row.unit}</td>
                <td>{row.cost}</td>
                <td>{row.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </>
  );
}
