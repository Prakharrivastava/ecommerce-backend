import React, { useState, useRef, useEffect } from "react";
import { ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";

// Imports mapped directly to your project structure (src/components/ui)
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const Verify = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([]);

  // Resend timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle typing input
  const handleChange = (index, value) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle pasting full 6-digit code
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const verificationCode = otp.join("");
    if (verificationCode.length !== 6) return;

    setIsSubmitting(true);
    console.log("Verifying Code:", verificationCode);

    setTimeout(() => {
      setIsSubmitting(false);
    }, 1500);
  };

  const handleResend = () => {
    setTimer(30);
    setOtp(Array(6).fill(""));
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-2xl shadow-lg border border-border">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-primary/10 rounded-full text-primary">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Verify Your Account</h1>
          <p className="text-sm text-muted-foreground">
            We’ve sent a 6-digit verification code to your email. Enter it below to proceed.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-center block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Verification Code
            </Label>
            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <Input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-12 text-center text-xl font-bold"
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={otp.join("").length !== 6 || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Verifying..." : "Verify Code"}
          </Button>
        </form>

        {/* Navigation & Resend */}
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {timer > 0 ? (
            <span>Resend code in <strong className="text-primary">{timer}s</strong></span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Resend Code
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Verify;