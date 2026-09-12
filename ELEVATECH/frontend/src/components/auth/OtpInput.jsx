import { useRef } from "react";

/**
 * Split 6-box one-time-password input.
 *
 * - Digits only, auto-advances to the next box while typing
 * - Backspace moves back to the previous empty box
 * - Pasting a full code fills all boxes at once
 * - inputMode="numeric" keeps the mobile number pad visible
 */
export default function OtpInput({
  length = 6,
  value = "",
  onChange,
  disabled = false,
  invalid = false,
  autoFocus = false,
}) {
  const refs = useRef([]);

  const focusIndex = (index) => {
    const input = refs.current[index];
    if (input) {
      input.focus();
      input.select();
    }
  };

  function handleChange(index, char) {
    if (disabled) return;

    // Keep only the last typed character, digits only.
    const digit = char.replace(/\D/g, "").slice(-1);
    if (!digit) return;

    const next = (value.slice(0, index) + digit + value.slice(index + 1)).slice(0, length);
    onChange?.(next);

    if (index < length - 1) {
      focusIndex(index + 1);
    }
  }

  function handleKeyDown(index, event) {
    if (disabled) return;

    if (event.key === "Backspace") {
      if (value[index]) {
        // Clear the box under the cursor without shifting the remaining digits.
        const chars = value.padEnd(length, " ").split("");
        chars[index] = " ";
        onChange?.(chars.join("").trimEnd().replace(/ /g, ""));
        const input = refs.current[index];
        if (input) input.focus();
      } else if (index > 0) {
        focusIndex(index - 1);
      }
      event.preventDefault();
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      focusIndex(index - 1);
      event.preventDefault();
      return;
    }

    if (event.key === "ArrowRight" && index < length - 1) {
      focusIndex(index + 1);
      event.preventDefault();
    }
  }

  function handlePaste(index, event) {
    if (disabled) return;
    event.preventDefault();

    const text =
      event.clipboardData?.getData?.("text") ||
      event.clipboardData?.getData?.("text/plain") ||
      event.clipboardData ||
      "";
    const digits = String(text).replace(/\D/g, "").slice(0, length);

    if (!digits) return;

    const chars = value.padEnd(length, " ").split("");
    for (let i = 0; i < digits.length && index + i < length; i += 1) {
      chars[index + i] = digits[i];
    }

    onChange?.(chars.join("").trimEnd());
    focusIndex(Math.min(index + digits.length, length - 1));
  }

  const filled = value.padEnd(length, " ").split("");

  return (
    <div
      className="flex gap-2.5"
      onPaste={(event) => handlePaste(0, event)}
    >
      {filled.map((char, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={char === " " ? "" : char}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          aria-label={`Digit ${index + 1}`}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onFocus={(event) => event.target.select()}
          className={`otp-box ${invalid ? "otp-box--invalid" : ""}`}
        />
      ))}
    </div>
  );
}