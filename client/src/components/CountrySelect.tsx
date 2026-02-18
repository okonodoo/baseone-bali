/**
 * Reusable Country Select Dropdown + Phone Input with Country Code
 * Used in: BecomePartner, VendorPortal, Profile
 */
import { useState, useMemo, useEffect } from "react";

export interface Country {
  code: string;   // ISO 3166-1 alpha-2
  name: string;
  dialCode: string;
  flag: string;   // emoji flag
}

export const COUNTRIES: Country[] = [
  { code: "ID", name: "Indonesia", dialCode: "+62", flag: "\u{1F1EE}\u{1F1E9}" },
  { code: "TR", name: "Turkey", dialCode: "+90", flag: "\u{1F1F9}\u{1F1F7}" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "\u{1F1E6}\u{1F1FA}" },
  { code: "US", name: "United States", dialCode: "+1", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "FR", name: "France", dialCode: "+33", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "NL", name: "Netherlands", dialCode: "+31", flag: "\u{1F1F3}\u{1F1F1}" },
  { code: "RU", name: "Russia", dialCode: "+7", flag: "\u{1F1F7}\u{1F1FA}" },
  { code: "CN", name: "China", dialCode: "+86", flag: "\u{1F1E8}\u{1F1F3}" },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "\u{1F1EF}\u{1F1F5}" },
  { code: "KR", name: "South Korea", dialCode: "+82", flag: "\u{1F1F0}\u{1F1F7}" },
  { code: "SG", name: "Singapore", dialCode: "+65", flag: "\u{1F1F8}\u{1F1EC}" },
  { code: "MY", name: "Malaysia", dialCode: "+60", flag: "\u{1F1F2}\u{1F1FE}" },
  { code: "TH", name: "Thailand", dialCode: "+66", flag: "\u{1F1F9}\u{1F1ED}" },
  { code: "VN", name: "Vietnam", dialCode: "+84", flag: "\u{1F1FB}\u{1F1F3}" },
  { code: "PH", name: "Philippines", dialCode: "+63", flag: "\u{1F1F5}\u{1F1ED}" },
  { code: "IN", name: "India", dialCode: "+91", flag: "\u{1F1EE}\u{1F1F3}" },
  { code: "AE", name: "UAE", dialCode: "+971", flag: "\u{1F1E6}\u{1F1EA}" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "\u{1F1F8}\u{1F1E6}" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "\u{1F1E8}\u{1F1E6}" },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "\u{1F1E7}\u{1F1F7}" },
  { code: "MX", name: "Mexico", dialCode: "+52", flag: "\u{1F1F2}\u{1F1FD}" },
  { code: "ZA", name: "South Africa", dialCode: "+27", flag: "\u{1F1FF}\u{1F1E6}" },
  { code: "IT", name: "Italy", dialCode: "+39", flag: "\u{1F1EE}\u{1F1F9}" },
  { code: "ES", name: "Spain", dialCode: "+34", flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "PT", name: "Portugal", dialCode: "+351", flag: "\u{1F1F5}\u{1F1F9}" },
  { code: "SE", name: "Sweden", dialCode: "+46", flag: "\u{1F1F8}\u{1F1EA}" },
  { code: "NO", name: "Norway", dialCode: "+47", flag: "\u{1F1F3}\u{1F1F4}" },
  { code: "DK", name: "Denmark", dialCode: "+45", flag: "\u{1F1E9}\u{1F1F0}" },
  { code: "FI", name: "Finland", dialCode: "+358", flag: "\u{1F1EB}\u{1F1EE}" },
  { code: "CH", name: "Switzerland", dialCode: "+41", flag: "\u{1F1E8}\u{1F1ED}" },
  { code: "AT", name: "Austria", dialCode: "+43", flag: "\u{1F1E6}\u{1F1F9}" },
  { code: "BE", name: "Belgium", dialCode: "+32", flag: "\u{1F1E7}\u{1F1EA}" },
  { code: "PL", name: "Poland", dialCode: "+48", flag: "\u{1F1F5}\u{1F1F1}" },
  { code: "CZ", name: "Czech Republic", dialCode: "+420", flag: "\u{1F1E8}\u{1F1FF}" },
  { code: "HU", name: "Hungary", dialCode: "+36", flag: "\u{1F1ED}\u{1F1FA}" },
  { code: "RO", name: "Romania", dialCode: "+40", flag: "\u{1F1F7}\u{1F1F4}" },
  { code: "UA", name: "Ukraine", dialCode: "+380", flag: "\u{1F1FA}\u{1F1E6}" },
  { code: "NZ", name: "New Zealand", dialCode: "+64", flag: "\u{1F1F3}\u{1F1FF}" },
  { code: "HK", name: "Hong Kong", dialCode: "+852", flag: "\u{1F1ED}\u{1F1F0}" },
  { code: "TW", name: "Taiwan", dialCode: "+886", flag: "\u{1F1F9}\u{1F1FC}" },
  { code: "IL", name: "Israel", dialCode: "+972", flag: "\u{1F1EE}\u{1F1F1}" },
  { code: "EG", name: "Egypt", dialCode: "+20", flag: "\u{1F1EA}\u{1F1EC}" },
  { code: "NG", name: "Nigeria", dialCode: "+234", flag: "\u{1F1F3}\u{1F1EC}" },
  { code: "KE", name: "Kenya", dialCode: "+254", flag: "\u{1F1F0}\u{1F1EA}" },
  { code: "AR", name: "Argentina", dialCode: "+54", flag: "\u{1F1E6}\u{1F1F7}" },
  { code: "CL", name: "Chile", dialCode: "+56", flag: "\u{1F1E8}\u{1F1F1}" },
  { code: "CO", name: "Colombia", dialCode: "+57", flag: "\u{1F1E8}\u{1F1F4}" },
  { code: "IE", name: "Ireland", dialCode: "+353", flag: "\u{1F1EE}\u{1F1EA}" },
];

const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#c5a059]/50 focus:outline-none transition-colors";

/**
 * Country Select Dropdown
 */
export function CountrySelect({
  value,
  onChange,
  label,
  required = false,
  placeholder = "Select country...",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
}) {
  const sorted = useMemo(() => [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name)), []);

  return (
    <div>
      {label && (
        <label className="block text-xs font-mono text-[#8a8580] uppercase tracking-wider mb-2">
          {label} {required && "*"}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={inputClass}
      >
        <option value="" className="bg-[#1a1a1b] text-[#6b6560]">{placeholder}</option>
        {sorted.map((c) => (
          <option key={c.code} value={c.code} className="bg-[#1a1a1b]">
            {c.flag} {c.name} ({c.dialCode})
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Phone Input with Country Code Selector
 */
export function PhoneInput({
  value,
  onChange,
  label,
  required = false,
  placeholder = "Phone number",
  countryCode,
}: {
  value: string;
  onChange: (fullPhone: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  countryCode?: string;
}) {
  // Parse existing value to extract dial code
  const parsePhone = (val: string) => {
    for (const c of [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length)) {
      if (val.startsWith(c.dialCode)) {
        return { dialCode: c.dialCode, number: val.slice(c.dialCode.length).trim() };
      }
    }
    return { dialCode: "+62", number: val.replace(/^\+?\d{1,3}\s?/, "") };
  };

  const parsed = parsePhone(value);
  const [dialCode, setDialCode] = useState(parsed.dialCode);
  const [number, setNumber] = useState(parsed.number);

  // Update dial code when countryCode prop changes
  useEffect(() => {
    if (countryCode) {
      const country = COUNTRIES.find(c => c.code === countryCode);
      if (country && country.dialCode !== dialCode) {
        setDialCode(country.dialCode);
        if (number) {
          onChange(`${country.dialCode} ${number}`);
        }
      }
    }
  }, [countryCode, dialCode, number, onChange]);

  const sorted = useMemo(() => [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name)), []);

  const handleDialChange = (newDial: string) => {
    setDialCode(newDial);
    onChange(number ? `${newDial} ${number}` : "");
  };

  const handleNumberChange = (newNum: string) => {
    setNumber(newNum);
    onChange(newNum ? `${dialCode} ${newNum}` : "");
  };

  return (
    <div>
      {label && (
        <label className="block text-xs font-mono text-[#8a8580] uppercase tracking-wider mb-2">
          {label} {required && "*"}
        </label>
      )}
      <div className="flex gap-2">
        <select
          value={dialCode}
          onChange={(e) => handleDialChange(e.target.value)}
          className="w-[110px] shrink-0 px-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#c5a059]/50 focus:outline-none transition-colors"
        >
          {sorted.map((c) => (
            <option key={c.code} value={c.dialCode} className="bg-[#1a1a1b]">
              {c.flag} {c.dialCode}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={number}
          onChange={(e) => handleNumberChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className={`flex-1 ${inputClass}`}
        />
      </div>
    </div>
  );
}
