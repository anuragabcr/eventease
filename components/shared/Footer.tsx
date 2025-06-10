export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white text-gray-700">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        <p className="text-sm">
          Anurag Kumar -{" "}
          <a
            href={`mailto:anuragabcr@gmail.com`}
            className="text-blue-600 hover:underline"
          >
            anuragabcr@gmail.com
          </a>
        </p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a
            href="https://github.com/anuragabcr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/anuragabcr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
