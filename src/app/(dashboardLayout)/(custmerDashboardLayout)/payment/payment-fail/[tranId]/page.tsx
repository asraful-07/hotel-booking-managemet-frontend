/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

const Page = async ({ params }: { params: Promise<{ tranId: string }> }) => {
  const { tranId } = await params;

  return (
    <div className="text-center lg:w-1/2 mx-5 px-3 lg:mx-auto flex flex-col justify-center items-center bg-red-100 py-20 my-5 space-y-4">
      <img
        className="h-48 w-48"
        src="https://cdn-icons-png.flaticon.com/512/463/463612.png"
        alt="Payment Failed"
      />
      <h3 className="text-xl font-semibold text-red-600">Payment Failed!</h3>
      <p className="font-semibold">
        Transaction ID: <span>{tranId}</span>
      </p>
      <Link
        href="/"
        className="bg-emerald-500 hover:bg-black text-white px-6 py-2 rounded-full font-medium transition-all duration-300"
      >
        Try Again
      </Link>
    </div>
  );
};

export default Page;
