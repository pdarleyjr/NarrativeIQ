# EZ Narratives

![EZ Narratives Logo](assets/logo.png)

EZ Narratives is a cross-platform application for EMS and Fire professionals to quickly generate detailed, accurate PCR narratives. Built with Reflex and Kivy, it provides a seamless experience across web, desktop, and mobile platforms.

## Features

- **AI-Powered Narrative Generation**: Quickly create comprehensive EMS and Fire narratives using OpenAI's advanced language models
- **Cross-Platform**: Use on web, desktop (Windows, macOS, Linux), and mobile (iOS, Android)
- **Offline Support**: Generate narratives even without internet connection (with local models)
- **Customizable Templates**: Tailor narratives to your agency's specific requirements
- **Knowledge Base Integration**: Incorporate protocols and guidelines into narratives
- **Secure Cloud Storage**: Save and access your narratives from any device
- **NFIRS/NEMSIS Compliance**: Ensure your narratives meet industry standards

## Installation

### Web Application

The web application is hosted at [https://eznarratives.com](https://eznarratives.com).

### Desktop Application

Download the latest release for your platform:

- [Windows](https://eznarratives.com/downloads/windows)
- [macOS](https://eznarratives.com/downloads/macos)
- [Linux](https://eznarratives.com/downloads/linux)

### Mobile Application

- [iOS App Store](https://apps.apple.com/app/eznarratives)
- [Google Play Store](https://play.google.com/store/apps/details?id=org.eznarratives.app)

## Development Setup

### Prerequisites

- Python 3.9+
- pip
- virtualenv (recommended)

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/eznarratives.git
   cd eznarratives
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys and configuration
   ```

### Running the Application

#### Web (Reflex)

```bash
reflex run
```

The web application will be available at http://localhost:3000.

#### Desktop/Mobile (Kivy)

```bash
python main.py
```

### Building for Production

#### Web

```bash
reflex export
```

The built web application will be in the `.web` directory.

#### Desktop

```bash
pyinstaller eznarratives.spec
```

The packaged application will be in the `dist` directory.

#### iOS

```bash
# Install kivy-ios
pip install kivy-ios

# Build Kivy
toolchain build kivy

# Create iOS project
toolchain create EZNarratives ios

# Open in Xcode
open EZNarratives-ios/EZNarratives.xcodeproj
```

#### Android

```bash
# Build with Buildozer
buildozer android debug

# Install on connected device
buildozer android deploy
```

## Testing

Run the smoke tests to verify basic functionality:

```bash
python smoke_test.py
```

For more comprehensive testing:

```bash
pytest
```

## Project Structure

```
eznarratives/
├── app/                    # Reflex application
│   ├── components/         # UI components
│   ├── pages/              # Page definitions
│   └── states/             # State management
├── assets/                 # Static assets
├── lib/                    # Shared libraries
├── .env.local              # Environment variables
├── app.py                  # Reflex entry point
├── main.py                 # Kivy entry point
├── buildozer.spec          # Android build configuration
├── eznarratives.spec       # PyInstaller configuration
└── requirements.txt        # Python dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Reflex](https://reflex.dev/) - Python framework for building web applications
- [Kivy](https://kivy.org/) - Python framework for developing multi-touch applications
- [OpenAI](https://openai.com/) - AI language models
- [Supabase](https://supabase.com/) - Backend as a Service