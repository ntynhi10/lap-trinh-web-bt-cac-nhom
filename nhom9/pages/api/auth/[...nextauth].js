import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// ===== GIẢ LẬP DATABASE NGƯỜI DÙNG =====
const FAKE_USERS = {
  student: { password: "123456", role: "ROLE_STUDENT", name: "Nguyễn Văn Student" },
  advisor: { password: "123456", role: "ROLE_ADVISOR", name: "Trần Thị Advisor" },
};

// ===== GIẢ LẬP HÀM ĐĂNG NHẬP BACKEND =====
async function fakeLogin(username, password) {
  const user = FAKE_USERS[username];
  if (!user || user.password !== password) return null;

  const now = Date.now();
  return {
    id: username,
    name: user.name,
    role: user.role,
    accessToken: `access_token_${now}`,
    refreshToken: `refresh_token_${now}`,
    // accessToken hết hạn sau 60 giây
    accessTokenExpires: now + 60 * 1000,
  };
}

// ===== GIẢ LẬP HÀM REFRESH TOKEN BACKEND =====
async function refreshAccessToken(token) {
  try {
    console.log("🔄 Token hết hạn, đang refresh...");

    // Giả lập delay gọi API backend (200ms)
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Giả lập backend trả về token mới
    const now = Date.now();
    return {
      ...token,
      accessToken: `access_token_${now}`,
      accessTokenExpires: now + 60 * 1000, // Gia hạn thêm 60 giây
    };
  } catch (error) {
    console.error("❌ Refresh token thất bại:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

// ===== NEXTAUTH CONFIGURATION =====
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const result = await fakeLogin(
          credentials?.username,
          credentials?.password
        );
        if (result) return result;
        return null;
      },
    }),
  ],

  callbacks: {
    // ===== JWT CALLBACK =====
    // Được gọi mỗi khi JWT được tạo hoặc cập nhật
    async jwt({ token, user }) {
      // Lần đầu đăng nhập: user object được trả về từ authorize()
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
          role: user.role,
        };
      }

      // Token còn hạn → trả về token hiện tại
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Token hết hạn → gọi refresh
      return await refreshAccessToken(token);
    },

    // ===== SESSION CALLBACK =====
    // Đưa dữ liệu từ JWT vào session để component sử dụng
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.accessTokenExpires = token.accessTokenExpires;
      session.error = token.error;
      session.user = {
        ...session.user,
        role: token.role,
      };
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET || "nextauth-secret-dev-only",
};

export default NextAuth(authOptions);
