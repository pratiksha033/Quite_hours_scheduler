import './globals.css';

export const metadata = {
  title: 'Quiet Hours Scheduler',
  description: 'Schedule your quiet study time.',
};

// The <style> tag has been removed from this file to prevent hydration errors.
// The necessary CSS has been moved to the instructions.md file for you to
// add to your src/app/globals.css file.

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
