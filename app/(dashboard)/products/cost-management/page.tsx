import type { Metadata } from "next";

import { Dashboard } from "@/components/dashboard";
import { pageMetadata } from "@/lib/dashboard/navbar";

export const metadata: Metadata = pageMetadata("/products/cost-management");

const COSTS = [
  { sku: "USA-R01", name: "Gạo ST25 túi 5kg", unit: "Túi", cost: "86.000đ", updated: "18/03/2026" },
  { sku: "USA-C02", name: "Cà phê Arabica 1kg", unit: "Kg", cost: "145.000đ", updated: "17/03/2026" },
  { sku: "USA-T03", name: "Trà ô long hộp 200g", unit: "Hộp", cost: "52.000đ", updated: "16/03/2026" },
  { sku: "USA-M04", name: "Mật ong rừng 500ml", unit: "Chai", cost: "118.000đ", updated: "15/03/2026" },
  { sku: "USA-D05", name: "Đậu xanh nguyên hạt 1kg", unit: "Kg", cost: "34.000đ", updated: "14/03/2026" },
];

export default function CostPricePage() {
  return (
    <Dashboard id="products-main">
      <article className="overview-card">
        <div className="overview-table-wrap">
          <table className="overview-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Sản phẩm</th>
                <th>Đơn vị</th>
                <th className="is-num">Giá vốn</th>
                <th>Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {COSTS.map((row) => (
                <tr key={row.sku}>
                  <td className="overview-table__code">{row.sku}</td>
                  <td>{row.name}</td>
                  <td>{row.unit}</td>
                  <td className="is-num overview-table__money">{row.cost}</td>
                  <td className="overview-table__muted">{row.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </Dashboard>
  );
}
