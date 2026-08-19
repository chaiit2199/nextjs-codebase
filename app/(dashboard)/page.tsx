const STATS = [
  { label: "Doanh thu", value: "12,45 tỷ" },
  { label: "Đơn hàng", value: "1,248" },
  { label: "Đại lý hoạt động", value: "86" },
  { label: "Nhân viên", value: "32" },
];

const ORDERS = [
  { id: "#ORD-10482", agent: "Đại lý Hà Nội 01", total: "12.500.000đ", status: "Hoàn thành", tone: "is-done", date: "18/03/2026" },
  { id: "#ORD-10481", agent: "Đại lý HCM 03", total: "8.200.000đ", status: "Đang xử lý", tone: "is-process", date: "18/03/2026" },
  { id: "#ORD-10480", agent: "Đại lý Đà Nẵng", total: "15.800.000đ", status: "Đang giao", tone: "is-ship", date: "17/03/2026" },
  { id: "#ORD-10479", agent: "Đại lý Cần Thơ", total: "6.400.000đ", status: "Hoàn thành", tone: "is-done", date: "17/03/2026" },
  { id: "#ORD-10478", agent: "Đại lý Hải Phòng", total: "9.100.000đ", status: "Hủy", tone: "is-cancel", date: "16/03/2026" },
];

const STAFF = [
  { name: "Nguyễn Văn An", region: "Hà Nội", orders: 48, revenue: "2,4 tỷ" },
  { name: "Nguyễn Thị Bình", region: "TP.HCM", orders: 42, revenue: "2,1 tỷ" },
  { name: "Lê Minh Châu", region: "Đà Nẵng", orders: 36, revenue: "1,8 tỷ" },
  { name: "Phạm Quốc Dũng", region: "Cần Thơ", orders: 31, revenue: "1,5 tỷ" },
];

export default function DashboardPage() {
  return (
    <>
      <header className="admin-page-header">
        <h1>Tổng quan</h1>
        <input className="admin-search" type="search" placeholder="Search" />
      </header>

      <section className="admin-stats">
        {STATS.map((stat) => (
          <article key={stat.label} className="admin-card admin-stat">
            <span className="admin-stat__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 19V5" />
                <path d="M4 19h16" />
                <path d="M8 15l3-4 3 3 5-7" />
              </svg>
            </span>
            <div>
              <small>{stat.label}</small>
              <strong>{stat.value}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="admin-grid">
        <article className="admin-card">
          <div className="admin-card__head">
            <h2>Thống kê đơn hàng</h2>
          </div>
          <div className="admin-donut-wrap">
            <div className="admin-donut">
              <div className="admin-donut__label">
                <strong>341</strong>
                <span>đơn</span>
              </div>
            </div>
            <ul className="admin-legend">
              <li><i style={{ background: "#3b6e4b" }} /> Hoàn thành — 198</li>
              <li><i style={{ background: "#f59e0b" }} /> Đang xử lý — 67</li>
              <li><i style={{ background: "#7c6af7" }} /> Đang giao — 52</li>
              <li><i style={{ background: "#ef4444" }} /> Hủy — 24</li>
            </ul>
          </div>
        </article>

        <article className="admin-card">
          <div className="admin-card__head">
            <h2>Đơn hàng gần đây</h2>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Đại lý</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày</th>
              </tr>
            </thead>
            <tbody>
              {ORDERS.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.agent}</td>
                  <td>{order.total}</td>
                  <td>
                    <span className={`admin-badge ${order.tone}`}>{order.status}</span>
                  </td>
                  <td>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>

      <section className="admin-grid">
        <article className="admin-card">
          <div className="admin-card__head">
            <h2>Doanh thu theo thời gian</h2>
            <select className="admin-select" defaultValue="day">
              <option value="day">Theo ngày</option>
              <option value="week">Theo tuần</option>
              <option value="month">Theo tháng</option>
            </select>
          </div>
          <div className="admin-line-chart">
            <svg viewBox="0 0 400 120" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#3b6e4b"
                strokeWidth="3"
                points="0,90 50,78 100,82 150,55 200,62 250,40 300,48 350,22 400,30"
              />
            </svg>
            <div className="admin-axis">
              <span>T2</span><span>T3</span><span>T4</span><span>T5</span>
              <span>T6</span><span>T7</span><span>CN</span>
            </div>
          </div>
        </article>

        <article className="admin-card">
          <div className="admin-card__head">
            <h2>Top nhân viên bán hàng</h2>
          </div>
          <div className="admin-rank">
            {STAFF.map((person, index) => (
              <div key={person.name} className="admin-rank__row">
                <span className="admin-rank__index">{String(index + 1).padStart(2, "0")}</span>
                <span className="admin-rank__avatar">{person.name.charAt(0)}</span>
                <span>
                  {person.name}
                  <small>{person.region} · {person.orders} đơn</small>
                </span>
                <b>{person.revenue}</b>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
