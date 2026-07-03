import { useState, useRef, useEffect, useCallback } from 'react';

const OTPInput = ({ length = 6, onComplete, disabled = false, error = false }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Check if all OTP digits are filled and call onComplete
  const checkAndNotify = useCallback((newOtp) => {
    const allFilled = newOtp.every(digit => digit !== '');
    const otpString = newOtp.join('');
    if (allFilled && otpString.length === length) {
      onComplete(otpString);
    }
  }, [length, onComplete]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return; // Only allow numbers

    const newOtp = [...otp];
    // Handle paste (multiple digits)
    if (value.length > 1) {
      const digits = value.split('').slice(0, length);
      digits.forEach((digit, i) => {
        if (index + i < length) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      // Focus last filled input or next empty
      const lastIndex = Math.min(index + digits.length, length - 1);
      if (inputRefs.current[lastIndex]) {
        inputRefs.current[lastIndex].focus();
      }
      checkAndNotify(newOtp);
      return;
    }

    // Single digit input
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }

    checkAndNotify(newOtp);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        // Move to previous input on backspace if current is empty
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    } else if (e.key === 'Delete') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    const digits = pastedData.replace(/\D/g, '').split('').slice(0, length);
    if (digits.length === 0) return;

    const newOtp = [...otp];
    digits.forEach((digit, i) => {
      newOtp[i] = digit;
    });
    setOtp(newOtp);

    // Focus the last filled input
    const lastIndex = Math.min(digits.length - 1, length - 1);
    if (inputRefs.current[lastIndex]) {
      inputRefs.current[lastIndex].focus();
    }

    checkAndNotify(newOtp);
  };

  const inputClass = `w-12 h-14 md:w-14 md:h-16 text-center text-xl md:text-2xl font-bold border-2 rounded-xl outline-none transition-all duration-200 ${
    error
      ? 'border-red-400 bg-red-50 text-red-600'
      : 'border-[#E5E7EB] bg-white text-[#1F2937] focus:border-[#22C55E] focus:ring-2 focus:ring-green-100'
  } ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`;

  return (
    <div className="flex items-center justify-center gap-2 md:gap-3" onPaste={handlePaste}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={length > 1 ? undefined : 1}
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          disabled={disabled}
          className={inputClass}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default OTPInput;