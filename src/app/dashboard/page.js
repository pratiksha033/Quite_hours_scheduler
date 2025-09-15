import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Calendar from './Calendar';
import LogoutButton from './LogoutButton';

export default async function Dashboard() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // The middleware should handle this, but as a fallback:
  if (!session) {
    redirect('/login');
  }

  const { data: studyBlocks, error } = await supabase
    .from('study_blocks')
    .select('*')
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching study blocks:', error);
  }

  const addStudyBlock = async (formData) => {
    'use server';
    const title = formData.get('title');
    const startTime = formData.get('start_time');
    const endTime = formData.get('end_time');

    if (!title || !startTime || !endTime) return;
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;
    
    const utcStart = new Date(startTime).toISOString();
    const utcEnd = new Date(endTime).toISOString();

    await supabase.from('study_blocks').insert({
      user_id: user.id,
      title,
      start_time: utcStart,
      end_time: utcEnd,
    });

    revalidatePath('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Study Dashboard</h1>
            <p className="text-sm text-gray-600">
              Logged in as: {session.user.email}
            </p>
          </div>
          <LogoutButton />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <Calendar studyBlocks={studyBlocks || []} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Add New Study Block</h2>
            <form action={addStudyBlock} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="datetime-local"
                  name="start_time"
                  id="start_time"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="datetime-local"
                  name="end_time"
                  id="end_time"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Block
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
