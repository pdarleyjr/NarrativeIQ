import reflex as rx

config = rx.Config(
    app_name="eznarratives_reflex_kivy",
    api_url="http://localhost:8002",
    db_url="sqlite:///reflex.db",
    env=rx.Env.DEV,
    tailwind={
        "theme": {
            "extend": {
                "colors": {
                    "primary": {
                        "50": "#f0f9ff",
                        "100": "#e0f2fe",
                        "200": "#bae6fd",
                        "300": "#7dd3fc",
                        "400": "#38bdf8",
                        "500": "#0ea5e9",
                        "600": "#0284c7",
                        "700": "#0369a1",
                        "800": "#075985",
                        "900": "#0c4a6e",
                        "950": "#082f49",
                    },
                    "ems": {
                        "100": "#e6e7ff",
                        "200": "#c5c7fa",
                        "300": "#a3a5f7",
                        "400": "#8183f4",
                        "500": "#6366f1",  # Primary indigo
                        "600": "#4f46e5",  # Darker indigo
                        "700": "#4338ca",
                        "800": "#3730a3",
                        "900": "#312e81",
                        "950": "#1e1b4b",
                    },
                    "fire": {
                        "100": "#fee2e2",
                        "200": "#fecaca",
                        "300": "#fca5a5",
                        "400": "#f87171",
                        "500": "#ef4444",
                        "600": "#dc2626",
                        "700": "#b91c1c",
                        "800": "#991b1b",
                        "900": "#7f1d1d",
                        "950": "#450a0a",
                    },
                },
                "fontFamily": {
                    "sans": ["Inter", "ui-sans-serif", "system-ui"],
                },
            }
        },
        "plugins": ["@tailwindcss/typography", "@tailwindcss/forms"],
    }
)