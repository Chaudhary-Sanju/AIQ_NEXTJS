"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export const PHONE_COUNTRIES = [
  {
    code: "+852",
    label: "Hong Kong",
    digits: 8,
    placeholder: "51234567",
  },
  {
    code: "+977",
    label: "Nepal",
    digits: 10,
    placeholder: "9841234567",
  },
];

export const PHONE_REGEX = /^(\+852-\d{8}|\+977-\d{10})$/;
export const HONG_KONG_PHONE_REGEX = /^\+852-\d{8}$/;

export const getDigitsOnly = (value = "") =>
  String(value || "").replace(/\D/g, "");

export const onlyDigits = getDigitsOnly;

const hasCountryPrefix = (value, country) => {
  const raw = String(value || "").trim();
  const digits = getDigitsOnly(raw);
  const codeDigits = getDigitsOnly(country.code);

  return (
    raw.startsWith(country.code) ||
    (digits.length > country.digits && digits.startsWith(codeDigits))
  );
};

const getExplicitCountryCode = (value = "") => {
  const raw = String(value || "").trim();
  const digits = getDigitsOnly(raw);

  const prefixedCountry = PHONE_COUNTRIES.find((country) =>
    hasCountryPrefix(raw, country)
  );

  if (prefixedCountry) return prefixedCountry.code;
  if (digits.length === 10) return "+977";
  if (digits.length > 0 && digits.length <= 8) return "+852";

  return null;
};

export const parsePhoneValue = (value = "") => {
  const raw = String(value || "").trim();
  const digits = getDigitsOnly(raw);

  const prefixedCountry = PHONE_COUNTRIES.find((country) =>
    hasCountryPrefix(raw, country)
  );

  if (prefixedCountry) {
    const codeDigits = getDigitsOnly(prefixedCountry.code);

    return {
      countryCode: prefixedCountry.code,
      localNumber: digits.slice(
        codeDigits.length,
        codeDigits.length + prefixedCountry.digits
      ),
    };
  }

  if (digits.length === 10) {
    return {
      countryCode: "+977",
      localNumber: digits.slice(0, 10),
    };
  }

  return {
    countryCode: "+852",
    localNumber: digits.slice(0, 8),
  };
};

export const getCountryFromPhone = (value = "") => {
  const parsed = parsePhoneValue(value);

  return (
    PHONE_COUNTRIES.find((item) => item.code === parsed.countryCode) ||
    PHONE_COUNTRIES[0]
  );
};

export const getLocalPhone = (value = "", country) => {
  const matchedCountry =
    PHONE_COUNTRIES.find((item) => item.code === country?.code) ||
    PHONE_COUNTRIES[0];

  const parsed = parsePhoneValue(value);
  const explicitCode = getExplicitCountryCode(value);

  if (matchedCountry.code === parsed.countryCode) {
    return parsed.localNumber.slice(0, matchedCountry.digits);
  }

  // Do not reinterpret a number from another country as a local number.
  if (explicitCode && explicitCode !== matchedCountry.code) {
    return "";
  }

  return getDigitsOnly(value).slice(0, matchedCountry.digits);
};

export const formatPhoneNumber = (countryCode, localNumber) => {
  const country =
    PHONE_COUNTRIES.find((item) => item.code === countryCode) ||
    PHONE_COUNTRIES[0];

  const digits = getDigitsOnly(localNumber).slice(0, country.digits);

  return digits ? `${country.code}-${digits}` : "";
};

export const formatCountryPhone = (country, localNumber) =>
  formatPhoneNumber(country?.code || "+852", localNumber);

export const normalizeCountryPhone = (value = "") => {
  const parsed = parsePhoneValue(value);
  return formatPhoneNumber(parsed.countryCode, parsed.localNumber);
};

export const normalizeHongKongPhone = (value = "") => {
  const raw = String(value || "").trim();
  const explicitCode = getExplicitCountryCode(raw);

  if (explicitCode && explicitCode !== "+852") {
    return "";
  }

  const hongKong = PHONE_COUNTRIES[0];
  const digits = getDigitsOnly(raw);
  const codeDigits = getDigitsOnly(hongKong.code);
  const localNumber = hasCountryPrefix(raw, hongKong)
    ? digits.slice(codeDigits.length, codeDigits.length + hongKong.digits)
    : digits.slice(0, hongKong.digits);

  return formatPhoneNumber(hongKong.code, localNumber);
};

export const isValidPhoneNumber = (value = "") => {
  const normalized = normalizeCountryPhone(value);
  return PHONE_REGEX.test(normalized);
};

export const isValidHongKongPhone = (value = "") =>
  HONG_KONG_PHONE_REGEX.test(normalizeHongKongPhone(value));

export const isValidCountryPhone = isValidPhoneNumber;

export default function CountryPhoneInput({
  value = "",
  onChange,
  disabled = false,
  hasError = false,
  placeholder,
  className = "",
  inputClassName = "",
  allowedCountryCodes,
}) {
  const wrapperRef = useRef(null);

  const availableCountries = useMemo(() => {
    if (!Array.isArray(allowedCountryCodes) || !allowedCountryCodes.length) {
      return PHONE_COUNTRIES;
    }

    const allowed = new Set(allowedCountryCodes);
    const filtered = PHONE_COUNTRIES.filter((country) =>
      allowed.has(country.code)
    );

    return filtered.length ? filtered : [PHONE_COUNTRIES[0]];
  }, [allowedCountryCodes]);

  const isSingleCountry = availableCountries.length === 1;

  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(() => {
    const explicitCode = getExplicitCountryCode(value);

    if (
      explicitCode &&
      availableCountries.some((country) => country.code === explicitCode)
    ) {
      return explicitCode;
    }

    return availableCountries[0].code;
  });

  useEffect(() => {
    const explicitCode = getExplicitCountryCode(value);
    const explicitCountryIsAllowed = availableCountries.some(
      (country) => country.code === explicitCode
    );
    const selectedCountryIsAllowed = availableCountries.some(
      (country) => country.code === selectedCountryCode
    );

    if (explicitCode && explicitCountryIsAllowed) {
      setSelectedCountryCode(explicitCode);
      return;
    }

    if (!selectedCountryIsAllowed) {
      setSelectedCountryCode(availableCountries[0].code);
    }
  }, [value, availableCountries, selectedCountryCode]);

  useEffect(() => {
    if (isSingleCountry) {
      setIsCountryOpen(false);
    }
  }, [isSingleCountry]);

  useEffect(() => {
    if (!isCountryOpen) return;

    const handleClickOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsCountryOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsCountryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isCountryOpen]);

  const selectedCountry = useMemo(
    () =>
      availableCountries.find(
        (item) => item.code === selectedCountryCode
      ) || availableCountries[0],
    [availableCountries, selectedCountryCode]
  );

  const localNumber = useMemo(
    () => getLocalPhone(value, selectedCountry),
    [value, selectedCountry]
  );

  const handleCountryChange = (country) => {
    setSelectedCountryCode(country.code);
    setIsCountryOpen(false);
    onChange?.(formatPhoneNumber(country.code, localNumber));
  };

  const handleNumberChange = (event) => {
    onChange?.(formatPhoneNumber(selectedCountry.code, event.target.value));
  };

  return (
    <div
      ref={wrapperRef}
      className={[
        "relative w-full overflow-visible",
        isCountryOpen ? "z-[9999]" : "z-0",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "flex h-12 w-full items-center rounded-2xl border bg-white text-sm outline-none transition",
          "focus-within:border-[#1a4b8f] focus-within:ring-4 focus-within:ring-[#1a4b8f]/10",
          hasError ? "border-red-300" : "border-orange-100",
          disabled ? "cursor-not-allowed bg-neutral-100 opacity-60" : "",
        ].join(" ")}
      >
        {isSingleCountry ? (
          <div className="flex h-full min-w-[104px] shrink-0 items-center justify-center rounded-l-2xl px-4 font-bold text-[#1a4b8f]">
            {selectedCountry.code}
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled}
            aria-expanded={isCountryOpen}
            aria-haspopup="listbox"
            aria-label="Select phone country code"
            onClick={() => setIsCountryOpen((open) => !open)}
            className="flex h-full min-w-[104px] shrink-0 items-center justify-center gap-2 rounded-l-2xl px-4 font-bold text-[#1a4b8f] outline-none transition disabled:cursor-not-allowed"
          >
            <span>{selectedCountry.code}</span>

            <ChevronDown
              size={15}
              className={[
                "text-neutral-400 transition-transform duration-200",
                isCountryOpen ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>
        )}

        <div className="h-6 w-px shrink-0 bg-orange-100" />

        <input
          type="text"
          inputMode="numeric"
          autoComplete="tel"
          value={localNumber}
          disabled={disabled}
          onChange={handleNumberChange}
          placeholder={placeholder || selectedCountry.placeholder}
          maxLength={selectedCountry.digits}
          aria-label={`${selectedCountry.label} phone number`}
          className={[
            "h-full min-w-0 flex-1 rounded-r-2xl bg-transparent px-4 text-sm text-neutral-900 outline-none placeholder:text-neutral-400",
            "disabled:cursor-not-allowed",
            inputClassName,
          ].join(" ")}
        />
      </div>

      {!isSingleCountry && isCountryOpen ? (
        <div
          role="listbox"
          aria-label="Phone country codes"
          className="absolute left-0 top-[calc(100%+10px)] z-[10000] w-[280px] overflow-hidden rounded-[22px] border border-orange-100 bg-white p-2 shadow-[0_18px_45px_rgba(15,42,94,0.16)] ring-1 ring-black/5"
        >
          <div className="px-3 pb-2 pt-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400">
              Select country
            </p>
          </div>

          <div className="space-y-1">
            {availableCountries.map((country) => {
              const active = country.code === selectedCountry.code;

              return (
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  key={country.code}
                  onClick={() => handleCountryChange(country)}
                  className={[
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition",
                    active
                      ? "bg-blue-50 text-[#1a4b8f]"
                      : "text-neutral-700 hover:bg-orange-50",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-10 w-16 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold",
                      active
                        ? "bg-white text-[#1a4b8f] shadow-sm"
                        : "bg-neutral-50 text-neutral-700",
                    ].join(" ")}
                  >
                    {country.code}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold">
                      {country.label}
                    </span>
                  </span>

                  {active ? (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1a4b8f] text-white">
                      <Check size={15} strokeWidth={2.8} />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}