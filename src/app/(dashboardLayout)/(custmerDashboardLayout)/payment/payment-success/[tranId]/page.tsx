/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

const Page = async ({ params }: { params: Promise<{ tranId: string }> }) => {
  const { tranId } = await params;

  // Get current date for order summary
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with gradient using primary color */}
        <div className="bg-gradient-to-r from-[#caa05c] to-[#ab8965] p-6 text-center">
          <img
            className="h-24 w-24 mx-auto bg-white rounded-full p-4 shadow-lg"
            src="https://medicare-point-1bbbf.web.app/assets/check-e4a86f6b.png"
            alt="Payment Success"
          />
          <h1 className="text-3xl font-bold text-white mt-4">
            Payment Successful!
          </h1>
          <p className="text-white/90 mt-2">Thank you for your payment</p>
        </div>

        {/* Main Content */}
        <div className="p-8 space-y-6">
          {/* Transaction Details */}
          <div className="bg-[#caa05c1a] rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#caa05c]/30">
              <span className="text-gray-600 font-medium">Transaction ID:</span>
              <span className="text-[#caa05c] font-mono font-bold text-lg">
                {tranId}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-[#caa05c]/30">
              <span className="text-gray-600 font-medium">Date & Time:</span>
              <span className="text-gray-800 font-medium">{currentDate}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Payment Status:</span>
              <span className="text-green-600 font-semibold flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Completed
              </span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#caa05c]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
              Order Summary
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Reference:</span>
                <span className="text-gray-800 font-mono text-xs">
                  PAY-{tranId.slice(-8)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Method:</span>
                <span className="text-gray-800">
                  Credit Card / Online Banking
                </span>
              </div>
            </div>
          </div>

          {/* Confirmation Message */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full inline-flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                <span className="text-sm font-medium">
                  Confirmation Email Sent
                </span>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              A confirmation email with your payment details has been sent to
              your registered email address. Please check your inbox (and spam
              folder) for the receipt.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/dashboard"
              className="flex-1 text-center bg-[#caa05c] hover:bg-[#ab8965] text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                My Account
              </span>
            </Link>
            <Link
              href="/"
              className="flex-1 text-center border-2 border-[#caa05c] text-[#caa05c] hover:bg-[#caa05c] hover:text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
                Back to Home
              </span>
            </Link>
          </div>

          {/* Help Section */}
          <div className="text-center pt-4">
            <p className="text-xs text-gray-500">
              Need help? Contact our support team at{" "}
              <a
                href="mailto:support@example.com"
                className="text-[#caa05c] hover:underline"
              >
                support@example.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
