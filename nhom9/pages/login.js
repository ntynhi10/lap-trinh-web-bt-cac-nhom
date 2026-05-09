import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Nếu đã đăng nhập → redirect về dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("❌ Sai tên đăng nhập hoặc mật khẩu!");
    } else {
      router.push("/");
    }
  };

  if (status === "loading") return <div style={styles.loading}>Đang tải...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>🔐</div>
        <h1 style={styles.title}>Đăng Nhập</h1>
        <p style={styles.subtitle}>NextAuth Token Refresh Demo</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="student hoặc advisor"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="123456"
              required
            />
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "⏳ Đang đăng nhập..." : "Đăng Nhập"}
          </button>
        </form>

        <div style={styles.credBox}>
          <p style={styles.credTitle}>🔑 Tài Khoản Demo:</p>
          <div style={styles.credRow}>
            <span>👨‍🎓 Student:</span>
            <code style={styles.code}>student</code> /{" "}
            <code style={styles.code}>123456</code>
            <span style={styles.roleBadge("student")}>ROLE_STUDENT</span>
          </div>
          <div style={styles.credRow}>
            <span>👨‍🏫 Advisor:</span>
            <code style={styles.code}>advisor</code> /{" "}
            <code style={styles.code}>123456</code>
            <span style={styles.roleBadge("advisor")}>ROLE_ADVISOR</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  loading: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "50px 40px",
    width: "100%",
    maxWidth: "460px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    textAlign: "center",
  },
  iconWrap: {
    fontSize: "56px",
    marginBottom: "16px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "6px",
  },
  subtitle: {
    color: "#888",
    fontSize: "14px",
    marginBottom: "32px",
  },
  form: {
    textAlign: "left",
  },
  field: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#555",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  errorBox: {
    background: "#ffe8e8",
    color: "#c0392b",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
    textAlign: "center",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
  },
  credBox: {
    background: "#f8f9fa",
    borderRadius: "10px",
    padding: "20px",
    marginTop: "28px",
    textAlign: "left",
  },
  credTitle: {
    fontWeight: "700",
    color: "#444",
    marginBottom: "12px",
    fontSize: "14px",
  },
  credRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "8px",
    fontSize: "13px",
    color: "#555",
    flexWrap: "wrap",
  },
  code: {
    background: "#e9ecef",
    padding: "2px 6px",
    borderRadius: "4px",
    color: "#d63384",
    fontWeight: "600",
    fontFamily: "monospace",
  },
  roleBadge: (type) => ({
    marginLeft: "auto",
    background: type === "advisor" ? "#667eea" : "#6c757d",
    color: "white",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "600",
  }),
};
