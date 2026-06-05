
import { SiGoogleforms } from "react-icons/si";
import { LuUsers } from "react-icons/lu";
import { CiSquareCheck } from "react-icons/ci";
import { IoMdAddCircleOutline } from "react-icons/io";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
    console.log("User not found");
  }

  // Fetch metrics
  // 1. Total Forms
  const { count: formsCount } = await supabase
    .from('forms')
    .select('*', { count: 'exact', head: true })

  // 2. Total Quizzes
  const { count: quizzesCount } = await supabase
    .from('forms')
    .select('*', { count: 'exact', head: true })
    .eq('is_quiz', true);

  // 3. Total Responses (RLS filters for own forms)
  const { count: responsesCount } = await supabase
    .from('responses')
    .select('*', { count: 'exact', head: true });

  // 4. Recent Responses
  const { data: recentResponses } = await supabase
    .from('responses')
    .select('*, forms!inner(title)')
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <div className="min-h-screen bg-[#FFF7EF]">

      <main className="px-8 py-6">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#4A2E1F]">Hare Krishna! 🙏</h1>
          <p className="text-[#7A5A4A] mt-1">
            Welcome to your form management dashboard
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="group bg-white rounded-xl border border-[#F2E6D8] p-6 hover:bg-[#FFF1E3] hover:text-[#F58220] transition:transform duration-200">
            <div className="flex justify-between items-start">
              <p className="text-sm text-[#7A5A4A]">Total Forms</p>
              <SiGoogleforms className="text-[#9A7A6A] group-hover:text-[#F58220]" />
            </div>
            <h2 className="text-3xl font-bold text-[#4A2E1F] mt-2 group-hover:text-[#F58220]">
              {formsCount || 0}
            </h2>
            <p className="text-xs text-[#9A7A6A] mt-1">Active forms</p>
          </div>

          <div className="group bg-white rounded-xl border border-[#F2E6D8] p-6 hover:bg-[#FFF1E3] hover:text-[#F58220] transition:transform duration-200">
            <div className="flex justify-between items-start">
              <p className="text-sm text-[#7A5A4A]">Total Responses</p>
              <LuUsers className="text-[#9A7A6A] group-hover:text-[#F58220]" />
            </div>
            <h2 className="text-3xl font-bold text-[#4A2E1F] mt-2 group-hover:text-[#F58220]">
              {responsesCount || 0}
            </h2>
            <p className="text-xs text-[#9A7A6A] mt-1">
              Submissions received
            </p>
          </div>

          <div className="group bg-white rounded-xl border border-[#F2E6D8] p-6 hover:bg-[#FFF1E3] hover:text-[#F58220] transition:transform duration-200">
            <div className="flex justify-between items-start">
              <p className="text-sm text-[#7A5A4A]">Quizzes</p>
              <CiSquareCheck className="text-[#9A7A6A] group-hover:text-[#F58220]" />
            </div>
            <h2 className="text-3xl font-bold text-[#4A2E1F] mt-2 group-hover:text-[#F58220]">
              {quizzesCount || 0}
            </h2>
            <p className="text-xs text-[#9A7A6A] mt-1">
              Assesement Forms
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-[#F2E6D8] p-6">
            <h3 className="text-xl font-semibold text-[#4A2E1F]">
              Quick Actions
            </h3>
            <p className="text-sm text-[#7A5A4A] mb-4">
              Common tasks at your fingertips
            </p>

            <Link href="/forms/new">
                <button className="cursor-pointer w-full bg-[#F58220] text-white py-3 px-4 rounded-lg mb-3 flex items-center justify-start gap-2">
                <IoMdAddCircleOutline />
                Create New Form
                </button>
            </Link>

            <Link href="/admin/allforms">
                <button className="cursor-pointer w-full border border-[#F2E6D8] py-3 px-4 rounded-lg text-[#4A2E1F] flex items-center justify-start gap-2 hover:bg-[#FFF1E3] hover:text-[#F58220] transition-colors duration-200">
                <SiGoogleforms />
                View All Forms
                </button>
            </Link>
          </div>

          {/* Recent Responses */}
          <div className="bg-white rounded-xl border border-[#F2E6D8] p-6">
            <h3 className="text-xl font-semibold text-[#4A2E1F]">
              Recent Responses
            </h3>
            <p className="text-sm text-[#7A5A4A] mb-4">
              Latest form submissions
            </p>

            <ul className="space-y-4 text-sm">
                {recentResponses?.map((response) => (
                    <li key={response.id} className="flex justify-between items-center bg-[#FAFAFA] p-3 rounded-lg">
                        <div>
                            <p className="text-[#4A2E1F] font-medium">
                                {response.forms?.title || 'Untitled Form'}
                            </p>
                            <span className="text-[#9A7A6A] text-xs">
                                {new Date(response.created_at).toLocaleDateString()} at {new Date(response.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                    </li>
                ))}

                {(!recentResponses || recentResponses.length === 0) && (
                    <li className="text-center text-stone-400 py-4">
                        No responses yet.
                    </li>
                )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
