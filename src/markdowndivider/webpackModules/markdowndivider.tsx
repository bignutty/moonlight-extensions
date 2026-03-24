import React from "@moonlight-mod/wp/react";
import * as Markdown from "@moonlight-mod/wp/markdown_markdown";

Markdown.addRule(
    "horizontalRule",
    (rules) => ({
        // Placed near blockQuote to ensure it parses as a block-level element
        order: rules.blockQuote.order - 0.5,
        match: function (text, state) {
            if (state.inQuote) return null;

            // Matches 3 or more hyphens on a line by themselves (allowing trailing spaces)
            // Matches: "---", "----", "---   "
            return /^---+[ \t]*(?:\n|$)/.exec(text);
        },
        parse: function (capture, parse, state) {
            return {};
        },
        react: function (node, recurseOutput, state) {
            return (
                <div
                    className="markdown-hr-container"
                    style={{ padding: "8px 0", width: "100%" }}
                >
                    <hr
                        className="markdown-hr"
                        style={{
                            border: "none",
                            borderTop: "1px solid var(--border-normal)", // Blends with Discord's theme
                            margin: 0,
                            width: "100%",
                        }}
                    />
                </div>
            );
        },
    }),
    () => ({
        type: "verbatim",
    }),
    "horizontalRule",
);

// Blacklist from inline contexts like replies/autocompletes to prevent weird spacing
Markdown.blacklistFromRuleset("INLINE_REPLY_RULES", "horizontalRule");