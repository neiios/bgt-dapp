import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="page-wrapper mx-4">
      <div className="mx-auto my-8 flex max-w-lg flex-col gap-16 rounded border py-24 px-12 text-center shadow-lg">
        <h1 className="text-6xl font-bold">Oops!</h1>
        <div className="flex flex-col gap-4">
          <p className="text-2xl">Sorry, an unexpected error has occurred.</p>
          <p className="text-2xl">
            <i>{error.statusText || error.message}</i>
          </p>
        </div>
        <div>
          <Link
            to="/"
            className="rounded border py-2 px-4 font-bold shadow hover:bg-neutral-200"
          >
            Go back
          </Link>
        </div>
      </div>
    </div>
  );
}
