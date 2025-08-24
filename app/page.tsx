export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Creator Hub</h1>
        <p className="text-gray-600 mb-8">Welcome to the Creator Hub</p>
        <a
          href="/creator/dashboard"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </main>
  )
}