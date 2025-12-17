function HomePage() {
    return(
            <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-3xl text-center">
        <h1 className="mx-auto max-w-xl text-4xl font-extrabold leading-tight text-black">
          Every one says your <br />
          build is shit? <br />
          Test it.
        </h1>

        <p className="mt-6 text-sm text-gray-500">
          Go ahead and say just a little more about what you do.
        </p>

        <div className="mt-10 flex items-center justify-center gap-3">
          <button className="rounded-md bg-black px-4 py-2 text-xs font-semibold text-white">
            Log in
          </button>
          <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-black">
            Sign In
          </button>
        </div>
      </div>
    </div>
    )
}

export default HomePage;