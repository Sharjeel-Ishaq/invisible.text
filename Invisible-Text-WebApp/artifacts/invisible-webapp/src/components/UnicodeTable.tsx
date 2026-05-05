import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UnicodeEntry {
  u: string;
  d: string;
  h: string;
  e: string;
  url?: string;
}

const unicodeData: UnicodeEntry[] = [
  { u: "U+0020", d: "Space", h: "&#32;", e: "[ ]", url: "https://textsinvisible.com/space/" },
  { u: "U+00A0", d: "No-Break Space", h: "&nbsp;", e: "[ ]", url: "https://textsinvisible.com/no-break-space/" },
  { u: "U+2000", d: "En Quad", h: "&#8192;", e: "[ ]", url: "https://textsinvisible.com/en-quad/" },
  { u: "U+2001", d: "Em Quad", h: "&#8193;", e: "[ ]", url: "https://textsinvisible.com/em-quad/" },
  { u: "U+2002", d: "En Space", h: "&#8194;", e: "[ ]", url: "https://textsinvisible.com/en-space/" },
  { u: "U+2003", d: "Em Space", h: "&emsp;", e: "[ ]", url: "https://textsinvisible.com/em-space/" },
  { u: "U+2004", d: "Three-Per-Em Space", h: "&#8196;", e: "[ ]" },
  { u: "U+2005", d: "Four-Per-Em Space", h: "&#8197;", e: "[ ]" },
  { u: "U+2006", d: "Six-Per-Em Space", h: "&#8198;", e: "[ ]" },
  { u: "U+2007", d: "Figure Space", h: "&#8199;", e: "[ ]" },
  { u: "U+2008", d: "Punctuation Space", h: "&#8200;", e: "[ ]" },
  { u: "U+2009", d: "Thin Space", h: "&#8201;", e: "[ ]" },
  { u: "U+200A", d: "Hair Space", h: "&#8202;", e: "[ ]" },
  { u: "U+2028", d: "Line Separator", h: "&#8232;", e: "[ ]" },
  { u: "U+205F", d: "Medium Mathematical Space", h: "&#8287;", e: "[ ]" },
  { u: "U+3000", d: "Ideographic Space", h: "&#12288;", e: "[　]" },
  { u: "U+25A0", d: "Black Square", h: "&#9632;", e: "[■]" },
  { u: "U+0009", d: "Horizontal Tab", h: "&#9;", e: "[ ]" },
  { u: "U+000A", d: "Line Feed", h: "&#10;", e: "[ ]" },
  { u: "U+000C", d: "Form Feed", h: "&#12;", e: "[ ]" },
  { u: "U+001C", d: "File Separator", h: "&#28;", e: "[ ]" },
  { u: "U+200B", d: "Zero-Width Space", h: "&#8203;", e: "[​]" },
  { u: "U+200C", d: "Zero-Width Non-Joiner", h: "&#8204;", e: "[‌]" },
  { u: "U+2060", d: "Word Joiner", h: "&#8288;", e: "[⁠]" },
  { u: "U+2061", d: "Word Separator", h: "&#8289;", e: "[⁡]" },
  { u: "U+2062", d: "Paragraph Separator", h: "&#8290;", e: "[⁢]" },
  { u: "U+00AD", d: "Soft Hyphen", h: "&#173;", e: "[­]" },
  { u: "U+034F", d: "Combining Grapheme Joiner", h: "&#847;", e: "[­]" },
  { u: "U+061C", d: "Arabic Letter Mark", h: "&#1564;", e: "[؜؜؜]" },
  { u: "U+115F", d: "Hangul Choseong Filler", h: "&#4447;", e: "[ᅟ ]" },
  { u: "U+1160", d: "Hangul Jungseong Filler", h: "&#4448;", e: "[ᅠ ]" },
  { u: "U+17B4", d: "Khmer Vowel Inherent Aq", h: "&#6068;", e: "[឴ ]" },
  { u: "U+17B5", d: "Khmer Vowel Inherent Aa", h: "&#6069;", e: "[឵ ]" },
  { u: "U+180B", d: "FVS1", h: "&#6155;", e: "[᠋ ]" },
  { u: "U+180C", d: "FVS2", h: "&#6156;", e: "[᠌ ]" },
  { u: "U+180D", d: "FVS3", h: "&#6157;", e: "[᠍ ]" },
  { u: "U+180E", d: "MVS", h: "&#6158;", e: "[᠎ ]" },
  { u: "U+200D", d: "Zero Width Joiner", h: "&#8205;", e: "[‍ ]" },
  { u: "U+200E", d: "Left-to-Right Mark", h: "&#8206;", e: "[‎ ]" },
  { u: "U+200F", d: "Right-to-Left Mark", h: "&#8207;", e: "[‏ ]" },
  { u: "U+202A", d: "Left-to-Right Embedding", h: "&#8234;", e: "[‪ ]" },
  { u: "U+202B", d: "RLE", h: "&#8235;", e: "[‫ ]" },
  { u: "U+202C", d: "Pop Directional Formatting", h: "&#8236;", e: "[‬ ]" },
  { u: "U+202D", d: "Left-to-Right Override", h: "&#8237;", e: "[‭ ]" },
  { u: "U+202E", d: "Right-to-Left Override", h: "&#8238;", e: "[‮ ]" },
  { u: "U+202F", d: "Narrow No-Break Space", h: "&#8239;", e: "[  ]" },
  { u: "U+2063", d: "Invisible Separator", h: "&#8291;", e: "[⁣ ]" },
  { u: "U+2064", d: "Invisible Plus", h: "&#8292;", e: "[⁤ ]" },
  { u: "U+2066", d: "LRI", h: "&#8294;", e: "[⁦ ]" },
  { u: "U+2067", d: "RLI", h: "&#8294;", e: "[⁧ ]" },
  { u: "U+2068", d: "FSI", h: "&#8296;", e: "[⁨ ]" },
  { u: "U+2069", d: "Pop Directional Isolate", h: "&#8297;", e: "[⁩ ]" },
  { u: "U+206A", d: "Inhibit Symmetric Swapping", h: "&#8298;", e: "[⁪ ]" },
  { u: "U+2800", d: "Braille Pattern Blank", h: "&#10240;", e: "[⠀ ]" },
  { u: "U+206B", d: "Activate Symmetric Swapping", h: "&#8299;", e: "[⁫ ]" },
  { u: "U+206C", d: "Inhibit Arabic Form Shaping", h: "&#8300;", e: "[⁬ ]" },
  { u: "U+206D", d: "Activate Arabic Form Shaping", h: "&#8301;", e: "[⁭ ]" },
  { u: "U+206E", d: "National Digit Shapes", h: "&#8302;", e: "[⁮ ]" },
  { u: "U+206F", d: "Nominal Digit Shapes", h: "&#8303;", e: "[⁯ ]" },
  { u: "U+3164", d: "Hangul Filler", h: "&#12644;", e: "[ㅤ ]" },
  { u: "U+FE00", d: "Variation Selector-1", h: "&#65024;", e: "[︀ ]" },
  { u: "U+FE01", d: "Variation Selector-2", h: "&#65025;", e: "[︁ ]" },
  { u: "U+FE02", d: "Variation Selector-3", h: "&#65026;", e: "[︂ ]" },
  { u: "U+FE03", d: "Variation Selector-4", h: "&#65027;", e: "[︃ ]" },
  { u: "U+FE04", d: "Variation Selector-5", h: "&#65028;", e: "[︄ ]" },
  { u: "U+FE05", d: "Variation Selector-6", h: "&#65029;", e: "[︅ ]" },
  { u: "U+FE06", d: "Variation Selector-7", h: "&#65030;", e: "[︆ ]" },
  { u: "U+FE07", d: "Variation Selector-8", h: "&#65031;", e: "[︇ ]" },
  { u: "U+FE08", d: "Variation Selector-9", h: "&#65032;", e: "[︈ ]" },
  { u: "U+FE09", d: "Variation Selector-10", h: "&#65033;", e: "[︉ ]" },
  { u: "U+FE0A", d: "Variation Selector-11", h: "&#65034;", e: "[︊ ]" },
  { u: "U+FE0B", d: "Variation Selector-12", h: "&#65035;", e: "[︋ ]" },
  { u: "U+FE0C", d: "Variation Selector-13", h: "&#65036;", e: "[︌ ]" },
  { u: "U+FE0D", d: "Variation Selector-14", h: "&#65037;", e: "[︍ ]" },
  { u: "U+FE0E", d: "Variation Selector-15", h: "&#65038;", e: "[︎ ]" },
  { u: "U+FE0F", d: "Variation Selector-16", h: "&#65039;", e: "[️ ]" },
  { u: "U+FEFF", d: "Zero Width No-Break Space", h: "&#65279;", e: "[ ]" },
  { u: "U+FFA0", d: "Halfwidth Hangul Filler", h: "&#65216;", e: "[ﻀ ]" },
  { u: "U+FFFC", d: "Object Replacement Character", h: "&#65532;", e: "[￼ ]" },
  { u: "U+133FC", d: "Egyptian Hieroglyph Z015B", h: "&#80828;", e: "[𓮼 ]" },
  { u: "U+1D159", d: "Musical Symbol Null Notehead", h: "&#119065;", e: "[𝄙 ]" },
  { u: "U+1D173", d: "Musical Symbol Begin Beam", h: "&#119187;", e: "[𝆓 ]" },
  { u: "U+1D174", d: "Musical Symbol End Beam", h: "&#119188;", e: "[𝆔 ]" },
  { u: "U+1D175", d: "Musical Symbol Begin Tie", h: "&#119189;", e: "[𝆕 ]" },
  { u: "U+1D176", d: "Musical Symbol End Tie", h: "&#119190;", e: "[𝆖 ]" },
  { u: "U+1D177", d: "Musical Symbol Begin Slur", h: "&#119191;", e: "[𝆗 ]" },
  { u: "U+1D178", d: "Musical Symbol End Slur", h: "&#119192;", e: "[𝆘 ]" },
  { u: "U+1D179", d: "Musical Symbol Begin Phrase", h: "&#119193;", e: "[𝆙 ]" },
  { u: "U+1D17A", d: "Musical Symbol End Phrase", h: "&#119194;", e: "[𝆚 ]" },
  { u: "U+E0001", d: "Language Tag", h: "&#917505;", e: "[ ]" },
  { u: "U+E0020", d: "Tag Space", h: "&#917538;", e: "[ ]" },
  { u: "U+E0021", d: "Tag Exclamation Mark", h: "&#917539;", e: "[ ]" },
  { u: "U+E0022", d: "Tag Quotation Mark", h: "&#917540;", e: "[ ]" },
  { u: "U+E0023", d: "Tag Number Sign", h: "&#917541;", e: "[ ]" },
  { u: "U+E0024", d: "Tag Dollar Sign", h: "&#917542;", e: "[ ]" },
  { u: "U+E0025", d: "Tag Percent Sign", h: "&#917543;", e: "[ ]" },
  { u: "U+E0026", d: "Tag Ampersand", h: "&#917544;", e: "[ ]" },
  { u: "U+E0027", d: "Tag Apostrophe", h: "&#917545;", e: "[ ]" },
  { u: "U+E0028", d: "Tag Left Parenthesis", h: "&#917546;", e: "[ ]" },
  { u: "U+E0029", d: "Tag Right Parenthesis", h: "&#917547;", e: "[ ]" },
  { u: "U+E002A", d: "Tag Asterisk", h: "&#917548;", e: "[ ]" },
  { u: "U+E002B", d: "Tag Plus Sign", h: "&#917549;", e: "[ ]" },
  { u: "U+E002C", d: "Tag Comma", h: "&#917550;", e: "[ ]" },
  { u: "U+E002D", d: "Tag Hyphen-Minus", h: "&#917551;", e: "[ ]" },
  { u: "U+E002E", d: "Tag Full Stop", h: "&#917552;", e: "[ ]" },
  { u: "U+E002F", d: "Tag Solidus", h: "&#917553;", e: "[ ]" },
  { u: "U+E0030", d: "Tag Digit Zero", h: "&#917554;", e: "[ ]" },
];

function htmlDecode(input: string): string {
  const doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent ?? "";
}

const ACCENT = "#00a884";

export function UnicodeTable() {
  const { toast } = useToast();
  const [copiedRow, setCopiedRow] = useState<string | null>(null);

  const handleCopy = (entry: UnicodeEntry) => {
    const char = htmlDecode(entry.h);
    navigator.clipboard.writeText(char).then(() => {
      setCopiedRow(entry.u);
      toast({
        title: "Copied!",
        description: `${entry.d} (${entry.u}) copied to clipboard.`,
      });
      setTimeout(() => setCopiedRow(null), 2000);
    });
  };

  const scrollbarStyles = `
    .unicode-table-scroll::-webkit-scrollbar {
      width: 8px;
    }
    .unicode-table-scroll::-webkit-scrollbar-track {
      background: #ffffff;
      border-radius: 10px;
    }
    .unicode-table-scroll::-webkit-scrollbar-thumb {
      background: #00a884;
      border-radius: 10px;
    }
    .unicode-table-scroll::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }
  `;

  return (
    <div className="w-full">
      <style>{scrollbarStyles}</style>
      <div
        className="w-full overflow-x-auto rounded-lg bg-white shadow-sm"
        style={{ border: `2px solid ${ACCENT}` }}
      >
        <div className="unicode-table-scroll" style={{ maxHeight: 500, overflowY: "auto" }}>
          <table className="w-full border-collapse" style={{ minWidth: 560 }}>
            <thead style={{ backgroundColor: ACCENT, position: "sticky", top: 0, zIndex: 1 }}>
              <tr>
                {["Unicode", "Description", "HTML Entity", "Example (Click)"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-left text-xs font-display font-semibold uppercase tracking-wide text-white whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {unicodeData.map((entry) => (
                <tr
                  key={entry.u}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td
                    className="px-4 py-3 text-sm text-gray-500 font-mono"
                    style={{ width: "15%" }}
                  >
                    {entry.u}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600" style={{ width: "35%" }}>
                    {entry.url ? (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:underline"
                        style={{ color: "#007bff" }}
                      >
                        {entry.d}
                      </a>
                    ) : (
                      entry.d
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ width: "25%" }}>
                    <span
                      className="rounded px-1.5 py-0.5 text-xs border border-gray-200 font-mono"
                      style={{
                        backgroundColor: "#f4f4f4",
                        color: "#d63384",
                      }}
                    >
                      {entry.h}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 text-sm font-semibold cursor-pointer select-none transition-colors"
                    style={{
                      width: "25%",
                      color: copiedRow === entry.u ? "#16a34a" : ACCENT,
                    }}
                    onClick={() => handleCopy(entry)}
                    title="Click to copy"
                    data-testid={`unicode-example-${entry.u}`}
                  >
                    {copiedRow === entry.u ? "✓ Copied!" : entry.e}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
