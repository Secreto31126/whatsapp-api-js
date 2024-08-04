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
        languageOptions: {
            globals: globals.node
        }
    },
    {
        files: ["src/*"],

        plugins: {
            tsdoc
        },

        rules: {
            "tsdoc/syntax": "warn"
        }
    },
    {
        files: ["test/*"],

        languageOptions: {
            globals: {
                ...globals.mocha
            }
        },

        rules: {
            "@typescript-eslint/no-require-imports": "off"
        }
    }
);
