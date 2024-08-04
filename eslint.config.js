import js from "@eslint/js";
import ts from "typescript-eslint";
import prettier from "eslint-config-prettier";
import tsdoc from "eslint-plugin-tsdoc";
import globals from "globals";

export default ts.config(
    js.configs.recommended,
    ...ts.configs.recommended,
    prettier,
    {
        plugins: {
            tsdoc
        },

        languageOptions: {
            globals: globals.node
        },

        rules: {
            "tsdoc/syntax": "warn"
        }
    }
);
