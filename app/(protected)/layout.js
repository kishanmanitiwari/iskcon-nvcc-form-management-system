import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "../../components/navbar";

export default async function ProtectedLayout({ children }) {
  const cookieStore = await cookies();

  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9]">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
}
