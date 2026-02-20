import React from "@moonlight-mod/wp/react";
import * as Markdown from "@moonlight-mod/wp/markdown_markdown";
import { ASTNode } from "@moonlight-mod/types/coreExtensions/markdown";

import * as ScrollerClasses from "@moonlight-mod/wp/discord/components/common/Scroller.css";

const getOpt = (name: string) => {
  return moonlight.getConfigOption("markdowntable", name);
};

Markdown.addRule(
  "mdt",
  (rules) => ({
    // Placed near blockQuote to ensure it parses as a block-level element
    order: rules.blockQuote.order - 0.5,
    match: function (text, state) {
      if (state.inQuote) return null;

      // Standard Markdown Table Regex (requires leading/trailing pipes)
      // Matches:
      // | Header | Header |
      // | ------ | :----: |
      // | Cell   | Cell   |

      return /^\|([^\n]+)\| *\n\|([ \t-:|]+)\| *\n((?:\|[^\n]+\| *(?:\n|$))*)/.exec(
        text,
      );
    },
    parse: function (capture, parse, state) {
      const headerRow = capture[1];
      const alignmentRow = capture[2];
      const bodyRows = capture[3];

      // Determine column alignments from the separator row
      const alignments = alignmentRow.split("|").map((alignString) => {
        const align = alignString.trim();
        if (align.startsWith(":") && align.endsWith(":")) return "center";
        if (align.endsWith(":")) return "right";
        return "left";
      });

      // Parse header content
      const header = headerRow.split("|").map((cell, index) => ({
        content: parse(cell.trim(), state),
        align: alignments[index] || "left",
      }));

      // Parse body rows
      const rows = bodyRows
        .trim()
        .split("\n")
        .filter((row) => row.length > 0)
        .map((row) => {
          // Strip leading and trailing pipes before splitting into cells
          const cleanRow = row.replace(/^\||\|$/g, "");
          return cleanRow.split("|").map((cell, index) => ({
            content: parse(cell.trim(), state),
            align: alignments[index] || "left",
          }));
        });

      return { header, rows };
    },
    react: function (node, recurseOutput, state) {
      return (
        <div
          className={`markdown-table-container ${ScrollerClasses.thin} ${ScrollerClasses.fade}`}
          style={{ margin: "8px 0", overflowX: "auto" }}
        >
          <table
            className="markdown-table"
            style={{
              borderCollapse: "collapse",
              width: getOpt("fullWidth") ? "100%" : "fit-content",
              borderRadius: "4px",
              overflowX: "auto",
            }}
          >
            <thead>
              <tr>
                {node.header.map(
                  (cell: { align: any; content: ASTNode }, i: any) => (
                    <th
                      key={`th-${i}`}
                      style={{
                        textAlign: cell.align,
                        border: "1px solid var(--border-normal)",
                        padding: "6px 13px",
                        fontWeight: "bold",
                      }}
                    >
                      {recurseOutput(cell.content, state)}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {node.rows.map((row: any[], i: number) => (
                <tr
                  key={`tr-${i}`}
                  style={{
                    backgroundColor:
                      i % 2 === 0
                        ? "var(--background-base-low)"
                        : "var(--background-base-lower)",
                  }}
                >
                  {row.map((cell, j) => (
                    <td
                      key={`td-${i}-${j}`}
                      style={{
                        textAlign: cell.align,
                        border: "1px solid var(--border-normal)",
                        padding: "6px 13px",
                      }}
                    >
                      {recurseOutput(cell.content, state)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  }),
  () => ({
    type: "verbatim",
  }),
  "mdt",
);

// Blacklist from inline contexts like replies/autocompletes to prevent massive layout breaks
Markdown.blacklistFromRuleset("INLINE_REPLY_RULES", "mdt");
