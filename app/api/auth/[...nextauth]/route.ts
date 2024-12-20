//Original code:
// export { GET, POST } from '@/auth'

// Modified code:

import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };