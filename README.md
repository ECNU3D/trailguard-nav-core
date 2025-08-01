# TrailGuard Nav Core

This project is the core of the TrailGuard navigation application, built with Vite, React, TypeScript, and shadcn-ui. It's designed to be a cross-platform application using Capacitor to run on Android. 

**🚀 Now featuring AI-powered object detection using Google's Gemma 3n!**

TrailGuard Nav Core provides **offline plant and mushroom identification** through on-device AI inference, ensuring complete privacy and functionality even without internet connectivity.

## Project Structure

- `src/`: Contains the main React application code.
- `android/`: Android project managed by Capacitor.

## 🤖 AI-Powered Object Detection

TrailGuard Nav Core features a revolutionary **offline AI identification system** powered by Google's Gemma 3n model:

### ✨ Key Features
- **📱 Fully Offline**: No internet required after initial model download
- **🔍 Smart Identification**: AI-powered plant and mushroom recognition
- **🛡️ Safety First**: Automatic edibility classification (toxic/not-edible/edible)
- **⚡ Real-time Processing**: Fast on-device inference using MediaPipe GenAI
- **📸 Multi-Input**: Camera capture or gallery selection
- **🎯 High Accuracy**: Confidence scoring and detailed descriptions

### 🧠 How It Works
1. **Model Download**: First-time setup downloads Gemma 3n model (~2GB)
2. **Image Capture**: Take photo with camera or select from gallery
3. **AI Analysis**: On-device processing using MediaPipe GenAI
4. **Structured Results**: Get species name, edibility, warnings, and detailed description
5. **Safety Warnings**: AI emphasizes safety with conservative identification

### 🔧 Technical Implementation
- **Custom Capacitor Plugin**: Native Android plugin for Gemma 3n integration
- **MediaPipe GenAI**: Google's optimized on-device inference engine
- **TypeScript Integration**: Fully typed plugin interface
- **Progressive Enhancement**: Graceful fallbacks and error handling

## Getting Started

To get started with this project, you'll need to have Node.js and npm installed.

### Installation

1.  **Clone the repository:**

    ```sh
    git clone <YOUR_GIT_URL>
    cd <YOUR_PROJECT_NAME>
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    ```

3.  **Start the development server:**

    ```sh
    npm run dev
    ```

### Building for Production

To create a production build of the web assets, run:

```sh
npm run build
```

### Native Platforms

To run the application on Android, you'll need to use the Capacitor CLI.

1.  **Sync the web assets with the native projects:**

    ```sh
    npx cap sync
    ```

2.  **Open the native project in Android Studio:**

    ```sh
    npx cap open android
    ```

From there, you can build and run the application on a simulator or a physical device.

## Gemma 3n for Offline AI

This project uses [Gemma 3n](https://developers.googleblog.com/en/introducing-gemma-3n-developer-guide/), Google's latest on-device large language model, to power its offline features. Gemma 3n is a family of models designed for mobile-first, on-device applications, enabling powerful multimodal capabilities with a small memory footprint.

### Key Features of Gemma 3n in this Project:

*   **On-device processing:** All AI-powered features run directly on the user's device, ensuring privacy and offline availability.
*   **Multimodal capabilities:** Gemma 3n can understand text, image, audio, and video inputs, opening up possibilities for a wide range of features.
*   **Efficient performance:** The models are optimized to run efficiently on mobile hardware, providing a smooth user experience.

### Development with Gemma 3n

When working with Gemma 3n in this project, you'll primarily be interacting with it through the Capacitor bridge. The native Android code handles the model loading and inference, and the results are passed back to the React application.

For more information on the specifics of the Gemma 3n implementation, please refer to the native Android code in the `android/` directory.

## Technologies Used

-   **Vite**: For fast and modern web development.
-   **React**: For building the user interface.
-   **TypeScript**: For static typing.
-   **shadcn-ui**: For UI components.
-   **Tailwind CSS**: For styling.
-   **Capacitor**: For building the native Android application.
-   **Gemma 3n**: Google's on-device LLM for offline AI experiences.
