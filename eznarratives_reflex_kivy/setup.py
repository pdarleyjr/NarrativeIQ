from setuptools import setup, find_packages

setup(
    name="eznarratives_reflex_kivy",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "reflex",
        "kivy",
        "kivymd",
        "supabase",
        "openai",
        "python-dotenv",
    ],
)