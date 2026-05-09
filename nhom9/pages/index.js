import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// ===== GIẢ LẬP API BACKEND "Lấy danh sách lớp" =====
async function fakeGetClasses(accessToken) {
  // Giả lập delay 300ms
  await new Promise((r) => setTimeout(r, 300));
  return {
    classes: [
      { id: 1, name: "Lớp A1 - Công Nghệ Thông Tin", students: 30 },
      { id: 2, name: "Lớp A2 - Kỹ Thuật Phần Mềm", students: 28 },
      { id: 3, name: "Lớp A3 - Hệ Thống Thông Tin", students: 32 },
    ],
    usedToken: accessToken?.slice(0, 30) + "...",
    timestamp: new Date().toLocaleTimeString("vi-VN"),
  };
}

// ===== COMPONENT CHÍNH =====
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Đếm ngược thời gian token hết hạn
  useEffect(() => {
    if (!session?.accessTokenExpires) return;
    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((session.accessTokenExpires - Date.now()) / 1000)
      );
      setTimeLeft(remaining);
    }, 500);
    return () => clearInterval(interval);
  }, [session?.accessTokenExpires]);

  // ===== HANDLER: Lấy danh sách lớp =====
  const handleGetClasses = async () => {
    setLoading(true);
    setResult(null);
    try {
      // Gọi API giả lập với accessToken hiện tại từ session
      // Trong thực tế: accessToken đã được NextAuth tự động refresh trước khi đến đây
      const data = await fakeGetClasses(session?.accessToken);
      setResult({ success: true, data });
    } catch (err) {
      setResult({ success: false, error: err.message });
    }
    setLoading(false);
  };

  // ===== LOADING STATE =====
  if (status === "loading") {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.spinner}>⏳</div>
        <p>Đang tải session...</p>
      </div>
    );
  }

  // ===== CHƯA ĐĂNG NHẬP =====
  if (!session) return null;

  // ===== BỊ TỪ CHỐI TRUY CẬP (ROLE_STUDENT) =====
  if (session.user?.role !== "ROLE_ADVISOR") {
    return (
      <div style={styles.page}>
        <div style={styles.deniedCard}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>❌</div>
          <h1 style={styles.deniedTitle}>Bị Từ Chối Truy Cập</h1>
          <p style={styles.deniedText}>
            Trang này chỉ dành cho <strong>Cố Vấn (ROLE_ADVISOR)</strong>.
          </p>
          <p style={styles.deniedText}>
            Tài khoản của bạn có role:{" "}
            <span style={styles.roleBadge("student")}>
              {session.user?.role}
            </span>
          </p>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={styles.dangerBtn}
          >
            🚪 Đăng Xuất & Thử Tài Khoản Khác
          </button>
        </div>
      </div>
    );
  }

  // ===== DASHBOARD (ROLE_ADVISOR) =====
  const tokenExpired = timeLeft === 0;
  const tokenWarning = timeLeft !== null && timeLeft <= 10;

  return (
    <div style={styles.page}>
      <div style={styles.dashCard}>
        {/* Header */}
        <div style={styles.dashHeader}>
          <div>
            <h1 style={styles.dashTitle}>📊 Dashboard Cố Vấn</h1>
            <p style={styles.dashSub}>NextAuth Token Refresh Demo</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })} style={styles.logoutBtn}>
            🚪 Đăng Xuất
          </button>
        </div>

        {/* Session Info */}
        <div style={styles.infoGrid}>
          <InfoRow icon="👤" label="Người dùng" value={session.user?.name} />
          <InfoRow
            icon="🔑"
            label="Role"
            value={
              <span style={styles.roleBadge("advisor")}>{session.user?.role}</span>
            }
          />
          <InfoRow
            icon="⏱️"
            label="Access Token hết hạn sau"
            value={
              <span
                style={{
                  color: tokenExpired ? "#c0392b" : tokenWarning ? "#e67e22" : "#27ae60",
                  fontWeight: "700",
                  fontSize: "16px",
                }}
              >
                {timeLeft !== null ? `${timeLeft}s` : "Đang tính..."}
                {tokenExpired && " ⚠️ ĐÃ HẾT HẠN"}
              </span>
            }
          />
          <InfoRow
            icon="🎫"
            label="Token hiện tại"
            value={
              <code style={styles.tokenCode}>
                {session.accessToken?.slice(0, 35)}...
              </code>
            }
          />
        </div>

        {/* Hướng dẫn demo */}
        <div style={styles.guideBox}>
          <h3 style={styles.guideTitle}>📋 Hướng Dẫn Demo Token Refresh</h3>
          <ol style={styles.guideList}>
            <li>✅ Bấm <strong>"Lấy danh sách lớp"</strong> → Thành công (token còn hạn)</li>
            <li>⏳ Đợi đến khi <strong>Access Token hết hạn sau: 0s</strong> (60 giây)</li>
            <li>🔄 Bấm lại <strong>"Lấy danh sách lớp"</strong> → NextAuth tự động refresh token</li>
            <li>🛠️ Mở <strong>F12 → Console</strong> để xem log: <code style={styles.logCode}>🔄 Token hết hạn, đang refresh...</code></li>
          </ol>
          <p style={styles.guideNote}>
            💡 <strong>Điểm mấu chốt:</strong> Người dùng hoàn toàn <em>không biết</em> việc refresh token đang xảy ra!
          </p>
        </div>

        {/* Action buttons */}
        <div style={styles.btnRow}>
          <button
            onClick={handleGetClasses}
            disabled={loading}
            style={styles.primaryBtn}
          >
            {loading ? "⏳ Đang gọi API..." : "📋 Lấy Danh Sách Lớp"}
          </button>
        </div>

        {/* Kết quả */}
        {result && (
          <div style={result.success ? styles.successBox : styles.errorBox}>
            {result.success ? (
              <>
                <h4 style={{ color: "#27ae60", marginBottom: "12px" }}>
                  ✅ Gọi API Thành Công!
                </h4>
                <pre style={styles.pre}>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
                <p style={{ color: "#555", fontSize: "13px", marginTop: "10px" }}>
                  ⚠️ Nếu token vừa được refresh, bạn sẽ thấy token mới ở mục "Token hiện tại" phía trên.
                </p>
              </>
            ) : (
              <p style={{ color: "#c0392b" }}>❌ Lỗi: {result.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== SUB-COMPONENT: InfoRow =====
function InfoRow({ icon, label, value }) {
  return (
    <div style={styles.infoRow}>
      <span style={{ fontSize: "20px" }}>{icon}</span>
      <span style={styles.infoLabel}>{label}:</span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  );
}

// ===== STYLES =====
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    fontSize: "18px",
    color: "#555",
  },
  spinner: { fontSize: "48px" },
  dashCard: {
    background: "white",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "720px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  dashHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "12px",
  },
  dashTitle: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#333",
    margin: 0,
  },
  dashSub: { color: "#888", fontSize: "14px", marginTop: "4px" },
  logoutBtn: {
    padding: "10px 18px",
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
  infoGrid: {
    background: "#f8f9fa",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    flexWrap: "wrap",
  },
  infoLabel: { fontWeight: "600", color: "#667eea", minWidth: "200px" },
  infoValue: { color: "#333" },
  tokenCode: {
    background: "#e9ecef",
    padding: "2px 8px",
    borderRadius: "4px",
    fontFamily: "monospace",
    fontSize: "12px",
    color: "#333",
  },
  guideBox: {
    background: "#eef2ff",
    border: "1.5px solid #c7d2fe",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
  },
  guideTitle: {
    color: "#4f46e5",
    fontSize: "16px",
    marginBottom: "14px",
  },
  guideList: {
    paddingLeft: "20px",
    color: "#374151",
    fontSize: "14px",
    lineHeight: "2",
  },
  guideNote: {
    marginTop: "14px",
    color: "#555",
    fontSize: "13px",
    borderTop: "1px solid #c7d2fe",
    paddingTop: "12px",
  },
  logCode: {
    background: "#1e1e1e",
    color: "#4ade80",
    padding: "2px 6px",
    borderRadius: "4px",
    fontFamily: "monospace",
    fontSize: "12px",
  },
  btnRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  primaryBtn: {
    flex: 1,
    padding: "14px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
    minWidth: "200px",
  },
  dangerBtn: {
    marginTop: "20px",
    padding: "12px 24px",
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
  successBox: {
    background: "#f0fdf4",
    border: "1.5px solid #86efac",
    borderRadius: "12px",
    padding: "20px",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1.5px solid #fca5a5",
    borderRadius: "12px",
    padding: "20px",
  },
  pre: {
    background: "#1e1e1e",
    color: "#4ade80",
    padding: "16px",
    borderRadius: "8px",
    overflow: "auto",
    fontSize: "13px",
    lineHeight: "1.6",
    fontFamily: "monospace",
  },
  deniedCard: {
    background: "white",
    borderRadius: "20px",
    padding: "50px 40px",
    maxWidth: "480px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  deniedTitle: {
    color: "#c0392b",
    fontSize: "26px",
    marginBottom: "16px",
  },
  deniedText: {
    color: "#555",
    fontSize: "15px",
    marginBottom: "12px",
    lineHeight: "1.6",
  },
  roleBadge: (type) => ({
    display: "inline-block",
    padding: "4px 10px",
    background: type === "advisor" ? "#667eea" : "#6c757d",
    color: "white",
    borderRadius: "5px",
    fontSize: "12px",
    fontWeight: "600",
    fontFamily: "monospace",
  }),
};
