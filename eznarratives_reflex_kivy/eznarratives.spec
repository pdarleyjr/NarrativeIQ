# -*- mode: python ; coding: utf-8 -*-
from kivy_deps import sdl2, glew

block_cipher = None

a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('.env.local', '.'),
        ('assets', 'assets'),
    ],
    hiddenimports=[
        'plyer.platforms.win.filechooser',
        'plyer.platforms.macosx.filechooser',
        'plyer.platforms.linux.filechooser',
        'kivymd.uix.behaviors',
        'kivymd.uix.behaviors.focus_behavior',
        'kivymd.uix.behaviors.elevation',
        'kivymd.uix.behaviors.ripple_behavior',
        'kivymd.uix.behaviors.hover_behavior',
        'kivymd.uix.behaviors.touch_behavior',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(
    a.pure, 
    a.zipped_data,
    cipher=block_cipher
)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='EZNarratives',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon='assets/icon.ico',
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    *[Tree(p) for p in (sdl2.dep_bins + glew.dep_bins)],
    strip=False,
    upx=True,
    upx_exclude=[],
    name='EZNarratives',
)

# macOS specific
app = BUNDLE(
    coll,
    name='EZNarratives.app',
    icon='assets/icon.icns',
    bundle_identifier='org.eznarratives.app',
    info_plist={
        'NSHighResolutionCapable': 'True',
        'CFBundleShortVersionString': '0.1.0',
        'CFBundleVersion': '0.1.0',
        'NSRequiresAquaSystemAppearance': 'False',  # Support dark mode
        'CFBundleDisplayName': 'EZ Narratives',
        'CFBundleName': 'EZ Narratives',
        'CFBundleExecutable': 'EZNarratives',
        'CFBundleIdentifier': 'org.eznarratives.app',
        'CFBundleInfoDictionaryVersion': '6.0',
        'CFBundlePackageType': 'APPL',
        'LSApplicationCategoryType': 'public.app-category.medical',
        'LSMinimumSystemVersion': '10.14.0',  # Mojave or later
        'NSHumanReadableCopyright': '© 2025 EZ Narratives',
    },
)