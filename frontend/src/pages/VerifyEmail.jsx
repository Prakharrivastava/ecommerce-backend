import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    // Simulate API request to verify token
    const verifyToken = async () => {
      try {
        // Replace with your actual API endpoint:
        // await axios.post("/api/auth/verify-email", { token });
        
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setStatus("success");
        setMessage("Your email has been successfully verified!");
      } catch (err) {
        setStatus("error");
        setMessage("Verification link has expired or is invalid.");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
        
        {/* Status Icon */}
        <div className="flex justify-center">
          {status === "loading" && (
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
          )}
          {status === "success" && (
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          )}
          {status === "error" && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
              <XCircle className="w-10 h-10" />
            </div>
          )}
        </div>

        {/* Status Content */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {status === "loading" && "Verifying Email"}
            {status === "success" && "Email Verified"}
            {status === "error" && "Verification Failed"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>
        </div>

        {/* Actions */}
        {status !== "loading" && (
          <Button
            onClick={() => navigate("/login")}
            className="w-full flex items-center justify-center gap-2"
          >
            Go to Login <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;