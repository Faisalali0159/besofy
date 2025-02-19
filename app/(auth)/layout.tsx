import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-navy-800 transition-colors duration-300">
      {/* Left side - Form */}
      <div className="flex w-full flex-1 flex-col justify-center px-8 lg:px-12 xl:max-w-[720px]">
        {children}
      </div>

      {/* Right side - Image */}
      <div className="hidden flex-1 bg-gray-50 dark:bg-navy-800 lg:block transition-colors duration-300">
        <div className="relative h-full w-full">
        </div>
      </div>
    </div>
  );
}