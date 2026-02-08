import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, PieChart, History, FileBarChart, Bell, Settings,
  TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight,
  ChevronLeft, ChevronRight, LogOut, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartPie, Pie, Cell
} from "recharts";

const navItems = [
  { icon: LayoutDashboard, label: "Tổng quan", id: "overview" },
  { icon: PieChart, label: "Danh mục đầu tư", id: "portfolio" },
  { icon: History, label: "Lịch sử giao dịch", id: "history" },
  { icon: FileBarChart, label: "Báo cáo", id: "reports" },
  { icon: Bell, label: "Thông báo", id: "notifications" },
  { icon: Settings, label: "Cài đặt", id: "settings" },
];

const portfolioData = [
  { month: "T1", value: 1000 },
  { month: "T2", value: 1050 },
  { month: "T3", value: 1020 },
  { month: "T4", value: 1120 },
  { month: "T5", value: 1080 },
  { month: "T6", value: 1200 },
  { month: "T7", value: 1180 },
  { month: "T8", value: 1300 },
  { month: "T9", value: 1280 },
  { month: "T10", value: 1400 },
  { month: "T11", value: 1380 },
  { month: "T12", value: 1500 },
];

const allocationData = [
  { name: "Cổ phiếu", value: 40, color: "hsl(213, 52%, 25%)" },
  { name: "Trái phiếu", value: 25, color: "hsl(45, 70%, 47%)" },
  { name: "Bất động sản", value: 20, color: "hsl(213, 52%, 45%)" },
  { name: "Tiền gửi", value: 10, color: "hsl(45, 70%, 65%)" },
  { name: "Khác", value: 5, color: "hsl(213, 52%, 70%)" },
];

const transactions = [
  { id: "GD001", date: "05/02/2024", type: "Mua", asset: "VNM", amount: "150,000,000", status: "Hoàn thành" },
  { id: "GD002", date: "03/02/2024", type: "Bán", asset: "FPT", amount: "200,000,000", status: "Hoàn thành" },
  { id: "GD003", date: "01/02/2024", type: "Mua", asset: "VHM", amount: "300,000,000", status: "Hoàn thành" },
  { id: "GD004", date: "28/01/2024", type: "Cổ tức", asset: "HPG", amount: "25,000,000", status: "Đã nhận" },
  { id: "GD005", date: "25/01/2024", type: "Mua", asset: "MWG", amount: "100,000,000", status: "Hoàn thành" },
];

const notifications = [
  { title: "Báo cáo tháng 1/2024 đã sẵn sàng", time: "2 giờ trước", read: false },
  { title: "Danh mục đạt mức sinh lời 15%", time: "1 ngày trước", read: false },
  { title: "Cổ tức HPG đã được ghi nhận", time: "3 ngày trước", read: true },
  { title: "Điều chỉnh phân bổ danh mục Q1/2024", time: "1 tuần trước", read: true },
];

const profitData = [
  { month: "T1", profit: 5.2 },
  { month: "T2", profit: -1.5 },
  { month: "T3", profit: 8.3 },
  { month: "T4", profit: -2.1 },
  { month: "T5", profit: 10.5 },
  { month: "T6", profit: -1.0 },
  { month: "T7", profit: 7.8 },
  { month: "T8", profit: 9.2 },
  { month: "T9", profit: -3.5 },
  { month: "T10", profit: 8.0 },
  { month: "T11", profit: -1.2 },
  { month: "T12", profit: 12.0 },
];

const DashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-16" : "w-64"} gradient-navy flex flex-col transition-all duration-300 shrink-0`}>
        <div className="p-4 flex items-center justify-between border-b border-primary-foreground/10">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-gold/20 flex items-center justify-center">
                <span className="text-gold font-bold text-sm">ĐP</span>
              </div>
              <span className="text-sm font-semibold text-primary-foreground">Dashboard</span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-md text-primary-foreground/60 hover:bg-primary-foreground/10">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map(({ icon: Icon, label, id }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === id
                  ? "bg-gold/15 text-gold"
                  : "text-primary-foreground/60 hover:bg-primary-foreground/5 hover:text-primary-foreground"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-primary-foreground/10 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-primary-foreground/60 hover:bg-primary-foreground/5 hover:text-primary-foreground transition-colors"
          >
            <Home className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Về trang chủ</span>}
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-primary-foreground/60 hover:bg-primary-foreground/5 hover:text-primary-foreground transition-colors">
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {navItems.find((n) => n.id === activeTab)?.label || "Tổng quan"}
            </h1>
            <p className="text-sm text-muted-foreground">Xin chào, Nguyễn Văn A</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
            </button>
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-semibold text-gold">NA</span>
            </div>
          </div>
        </header>

        <div className="p-6">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "portfolio" && <PortfolioTab />}
          {activeTab === "history" && <HistoryTab />}
          {activeTab === "reports" && <ReportsTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </main>
    </div>
  );
};

const OverviewTab = () => (
  <div className="space-y-6">
    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Tổng tài sản", value: "1,500,000,000 ₫", change: "+15%", up: true, icon: DollarSign },
        { label: "Lợi nhuận YTD", value: "225,000,000 ₫", change: "+18.2%", up: true, icon: TrendingUp },
        { label: "Số giao dịch", value: "47", change: "+5", up: true, icon: History },
        { label: "Hiệu suất tháng", value: "+2.8%", change: "+0.3%", up: true, icon: ArrowUpRight },
      ].map(({ label, value, change, up, icon: Icon }) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl border border-border bg-card"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">{label}</span>
            <Icon className="w-5 h-5 text-gold" />
          </div>
          <p className="text-lg font-bold text-foreground">{value}</p>
          <span className={`text-xs font-medium flex items-center gap-0.5 mt-1 ${up ? "text-emerald-600" : "text-destructive"}`}>
            {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change} so với cùng kỳ
          </span>
        </motion.div>
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 p-5 rounded-xl border border-border bg-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Biến động tài sản (triệu VNĐ)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={portfolioData}>
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(45, 70%, 47%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(45, 70%, 47%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="hsl(45, 70%, 47%)" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="p-5 rounded-xl border border-border bg-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Phân bổ danh mục</h3>
        <ResponsiveContainer width="100%" height={200}>
          <RechartPie>
            <Pie data={allocationData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
              {allocationData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </RechartPie>
        </ResponsiveContainer>
        <div className="mt-3 space-y-1.5">
          {allocationData.map(({ name, value, color }) => (
            <div key={name} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                {name}
              </span>
              <span className="font-medium text-foreground">{value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Recent transactions */}
    <div className="p-5 rounded-xl border border-border bg-card">
      <h3 className="text-sm font-semibold text-foreground mb-4">Giao dịch gần đây</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Mã GD</th>
              <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Ngày</th>
              <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Loại</th>
              <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Tài sản</th>
              <th className="text-right py-2.5 px-3 text-xs font-medium text-muted-foreground">Giá trị (VNĐ)</th>
              <th className="text-right py-2.5 px-3 text-xs font-medium text-muted-foreground">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 3).map((tx) => (
              <tr key={tx.id} className="border-b border-border/50 hover:bg-muted/50">
                <td className="py-2.5 px-3 font-medium text-foreground">{tx.id}</td>
                <td className="py-2.5 px-3 text-muted-foreground">{tx.date}</td>
                <td className="py-2.5 px-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${tx.type === "Mua" ? "bg-emerald-500/10 text-emerald-600" : tx.type === "Bán" ? "bg-destructive/10 text-destructive" : "bg-gold/10 text-gold-dark"}`}>
                    {tx.type}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-medium text-foreground">{tx.asset}</td>
                <td className="py-2.5 px-3 text-right text-foreground">{tx.amount}</td>
                <td className="py-2.5 px-3 text-right text-muted-foreground">{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const PortfolioTab = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-5 rounded-xl border border-border bg-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Phân bổ tài sản</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RechartPie>
            <Pie data={allocationData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={2} label={({ name, value }) => `${name}: ${value}%`}>
              {allocationData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </RechartPie>
        </ResponsiveContainer>
      </div>
      <div className="p-5 rounded-xl border border-border bg-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Chi tiết danh mục</h3>
        <div className="space-y-3">
          {[
            { name: "VNM", quantity: "5,000 cp", value: "600,000,000", pnl: "+12.5%", up: true },
            { name: "FPT", quantity: "3,000 cp", value: "375,000,000", pnl: "+22.3%", up: true },
            { name: "VHM", quantity: "2,000 cp", value: "300,000,000", pnl: "-3.2%", up: false },
            { name: "HPG", quantity: "4,000 cp", value: "150,000,000", pnl: "+8.7%", up: true },
            { name: "Trái phiếu DN", quantity: "—", value: "375,000,000", pnl: "+7.2%", up: true },
          ].map(({ name, quantity, value, pnl, up }) => (
            <div key={name} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50">
              <div>
                <p className="text-sm font-semibold text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground">{quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{value} ₫</p>
                <p className={`text-xs font-medium ${up ? "text-emerald-600" : "text-destructive"}`}>{pnl}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const HistoryTab = () => (
  <div className="p-5 rounded-xl border border-border bg-card">
    <h3 className="text-sm font-semibold text-foreground mb-4">Lịch sử giao dịch</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Mã GD</th>
            <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Ngày</th>
            <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Loại</th>
            <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Tài sản</th>
            <th className="text-right py-2.5 px-3 text-xs font-medium text-muted-foreground">Giá trị (VNĐ)</th>
            <th className="text-right py-2.5 px-3 text-xs font-medium text-muted-foreground">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-border/50 hover:bg-muted/50">
              <td className="py-2.5 px-3 font-medium text-foreground">{tx.id}</td>
              <td className="py-2.5 px-3 text-muted-foreground">{tx.date}</td>
              <td className="py-2.5 px-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${tx.type === "Mua" ? "bg-emerald-500/10 text-emerald-600" : tx.type === "Bán" ? "bg-destructive/10 text-destructive" : "bg-gold/10 text-gold-dark"}`}>
                  {tx.type}
                </span>
              </td>
              <td className="py-2.5 px-3 font-medium text-foreground">{tx.asset}</td>
              <td className="py-2.5 px-3 text-right text-foreground">{tx.amount}</td>
              <td className="py-2.5 px-3 text-right text-muted-foreground">{tx.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ReportsTab = () => (
  <div className="space-y-6">
    <div className="p-5 rounded-xl border border-border bg-card">
      <h3 className="text-sm font-semibold text-foreground mb-4">Lợi nhuận hàng tháng (%)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={profitData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
            {profitData.map((entry, i) => (
              <Cell key={i} fill={entry.profit >= 0 ? "hsl(45, 70%, 47%)" : "hsl(0, 84%, 60%)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { title: "Báo cáo Q4/2023", date: "15/01/2024", type: "Quý" },
        { title: "Báo cáo tháng 1/2024", date: "05/02/2024", type: "Tháng" },
        { title: "Báo cáo năm 2023", date: "20/01/2024", type: "Năm" },
      ].map(({ title, date, type }) => (
        <div key={title} className="p-4 rounded-xl border border-border bg-card flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
          <span className="px-2 py-1 text-xs font-medium rounded bg-primary/5 text-primary">{type}</span>
        </div>
      ))}
    </div>
  </div>
);

const NotificationsTab = () => (
  <div className="space-y-3">
    {notifications.map(({ title, time, read }, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.05 }}
        className={`p-4 rounded-xl border ${read ? "border-border bg-card" : "border-gold/20 bg-gold/5"} flex items-start gap-3`}
      >
        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${read ? "bg-muted-foreground/30" : "bg-gold"}`} />
        <div>
          <p className={`text-sm ${read ? "text-muted-foreground" : "font-medium text-foreground"}`}>{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{time}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

const SettingsTab = () => (
  <div className="max-w-2xl space-y-6">
    <div className="p-6 rounded-xl border border-border bg-card">
      <h3 className="text-sm font-semibold text-foreground mb-4">Thông tin cá nhân</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Họ và tên", value: "Nguyễn Văn A" },
          { label: "Email", value: "nguyenvana@email.com" },
          { label: "Số điện thoại", value: "0912 345 678" },
          { label: "Mã khách hàng", value: "KH-2024-001" },
        ].map(({ label, value }) => (
          <div key={label}>
            <label className="text-xs text-muted-foreground">{label}</label>
            <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
          </div>
        ))}
      </div>
    </div>
    <div className="p-6 rounded-xl border border-border bg-card">
      <h3 className="text-sm font-semibold text-foreground mb-4">Gói dịch vụ</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Gói Nâng cao</p>
          <p className="text-xs text-muted-foreground">Phí: 1.2%/năm | AUM: 2,000,000,000 ₫</p>
        </div>
        <Button variant="gold" size="sm">Nâng cấp</Button>
      </div>
    </div>
  </div>
);

export default DashboardPage;
