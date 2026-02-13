export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} Jack&apos;s Blog. All rights reserved.
        </p>
        <p className="text-sm text-gray-500">
          Built with Spring Boot 3 + Next.js + TypeScript
        </p>
      </div>
    </footer>
  );
}
