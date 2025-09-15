import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Grab the Resend API key from the secrets
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    // Call the database function to get reminders
    const { data: reminders, error: remindersError } = await supabaseClient.rpc('get_study_blocks_for_reminder');
    if (remindersError) throw remindersError;

    if (reminders.length === 0) {
      console.info('No reminders to send.');
      return new Response(JSON.stringify({ message: 'No reminders to send.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    console.info(`Found ${reminders.length} reminder(s) to process.`);

    // Create an array of promises for all the emails to be sent
    const emailPromises = reminders.map(async (reminder) => {
      console.info(`Preparing email for ${reminder.email} for block: "${reminder.title}"`);
      
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'Quiet Hours Scheduler <onboarding@resend.dev>', // Replace with your verified domain
          to: [reminder.email],
          subject: `Reminder: Your study session "${reminder.title}" starts in 10 minutes!`,
          html: `
            <h1>Hi there!</h1>
            <p>This is a friendly reminder that your quiet study session, <strong>${reminder.title}</strong>, is scheduled to begin at <strong>${new Date(reminder.start_time).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute:'2-digit' })}</strong>.</p>
            <p>Time to get focused!</p>
          `,
        }),
      });

      if (!res.ok) {
        const errorBody = await res.json();
        console.error(`Failed to send email to ${reminder.email}. Status: ${res.status}`, errorBody);
        // Do not throw here, so other emails can still be sent
        return null;
      }
      
      console.info(`Email successfully sent to ${reminder.email}.`);
      return reminder.id; // Return the ID of the block for which an email was sent
    });

    // Wait for all emails to be sent
    const successfullySentIds = (await Promise.all(emailPromises)).filter(id => id !== null);

    // If no emails were sent successfully, exit
    if (successfullySentIds.length === 0) {
      console.warn('No emails were sent successfully.');
       return new Response(JSON.stringify({ message: 'Failed to send any emails.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Update the notification_sent_at timestamp for the blocks that were successfully processed
    const { error: updateError } = await supabaseClient
      .from('study_blocks')
      .update({ notification_sent_at: new Date().toISOString() })
      .in('id', successfullySentIds);

    if (updateError) throw updateError;
    
    console.info(`Successfully marked ${successfullySentIds.length} block(s) as sent.`);

    return new Response(JSON.stringify({ message: `Successfully processed ${successfullySentIds.length} reminders.` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
