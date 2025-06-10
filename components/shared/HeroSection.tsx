// import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-white py-20 px-6 md:px-12 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
          Welcome to <span className="text-blue-600">EventEase</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-600">
          A powerful event management platform built for seamless planning,
          collaboration, and participant engagement. Whether you&apos;re an
          Admin, Staff, or Event Owner, EventEase gives you full control to
          create, monitor, and manage your events effortlessly.
        </p>
        {/* <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <a
            href="/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition"
          >
            Get Started
          </a>
          <Link
            href="/event/demo"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-50 transition"
          >
            View Demo Event
          </Link>
        </div> */}
      </div>
    </section>
  );
}
