# FotoOwl 📸

A React Native photo gallery application that fetches and displays images from the FotoOwl API with features like favorites, sorting, search, and image viewing with zoom/pan capabilities.

## Features

- 🖼️ **Photo Gallery**: Browse images with smooth infinite scroll
- ❤️ **Favorites**: Mark and manage favorite images with persistent storage
- 🔍 **Search**: Search images by keywords
- 📊 **Sorting**: Sort by date, name, size, or popularity (ascending/descending)
- 🔍 **Image Viewer**: Full-screen image viewing with zoom, pan, and swipe gestures
- 🌓 **Dark/Light Theme**: Toggle between dark and light themes
- 📱 **Share & Save**: Share images or save to device gallery
- ⚡ **Performance**: Optimized with lazy loading, skeleton screens, and memory management

## Setup & Installation

### Prerequisites

- Node.js (16.x or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd fotoowl
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**

```bash
cp .env.example .env
```

Edit the `.env` file and add your API credentials:

```
EXPO_PUBLIC_API_BASE_URL=https://openapi.fotoowl.ai/open/event/image-list
EXPO_PUBLIC_API_KEY=your_api_key_here
EXPO_PUBLIC_EVENT_ID=your_event_id_here
```

4. **Start the development server**

```bash
npm start
```

### Running on Devices

#### iOS

```bash
npm run ios
```

_Requires Xcode and iOS Simulator_

#### Android

```bash
npm run android
```

_Requires Android Studio and Android Emulator/Device_

#### Web (for development)

```bash
npm run web
```

## Development Scripts

- `npm start` - Start Expo development server
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking
- `npm run ci` - Run complete CI pipeline (typecheck + lint + format + test)

## Architecture Overview

### High-Level Architecture

FotoOwl follows a modern React Native architecture with a focus on maintainability, performance, and user experience. The application is structured using a feature-based approach with clear separation of concerns.

**Core Architecture Patterns:**

1. **Component-Based Architecture**: The app is built using reusable, composable components with clear props interfaces and TypeScript definitions. Each component has a single responsibility and is thoroughly tested.

2. **Context-Based State Management**: Uses React Context for global state (favorites, theme) combined with local useState/useEffect for component-specific state. This provides a good balance between simplicity and functionality without the overhead of external state management libraries like Redux.

3. **Service Layer**: API interactions are abstracted into a dedicated service layer (`src/service/api.ts`) with built-in retry logic, timeout handling, and error management. This separation allows for easy testing and future API changes.

4. **Persistent Storage**: Utilizes AsyncStorage for local data persistence (favorites, theme preferences) with proper error handling and fallbacks.

### Key Design Decisions & Trade-offs

**1. Context vs Redux**: Chose React Context over Redux for simplicity. The app's state is relatively simple (favorites, theme), making Context sufficient. Trade-off: Less powerful dev tools and middleware, but significantly less boilerplate and better performance for this use case.

**2. Expo vs React Native CLI**: Used Expo for faster development and easier deployment. Trade-off: Some native module limitations, but provides excellent developer experience and simplified build process.

**3. TypeScript Integration**: Full TypeScript implementation provides excellent developer experience with autocomplete, error prevention, and self-documenting code. Trade-off: Slightly longer development time initially, but significant long-term maintenance benefits.

**4. Component Testing Strategy**: Focused on unit testing components with React Native Testing Library rather than integration tests. This provides fast feedback and ensures component reliability while keeping tests maintainable.

## Performance Optimizations

### Smooth Scrolling & Memory Management

The application implements several performance optimizations to ensure smooth scrolling and efficient memory usage:

**1. Virtual Scrolling**: Uses Expo's optimized FlashList instead of FlatList for the main image grid, providing better performance with large datasets and automatic memory management.

**2. Image Optimization**:

- Implements lazy loading with skeleton screens during image fetch
- Uses Expo Image component with built-in caching and memory management
- Thumbnail images are loaded first, with full-resolution images loaded on demand

**3. Memory Management**:

- Automatic image cache cleanup through Expo Image
- Proper cleanup of timeouts and abort controllers in useEffect hooks
- Efficient re-renders through proper dependency arrays and memoization where needed

**4. State Optimization**:

- Debounced search to prevent excessive API calls
- Pagination with proper loading states to avoid loading all images at once
- Local storage of favorites to prevent repeated API calls

**5. Bundle Optimization**:

- Code splitting ready (components are modularly designed)
- Efficient imports to reduce bundle size
- Proper tree shaking through ES6 modules

## Testing

The application includes comprehensive unit tests covering:

- **Component Tests**: All UI components with user interaction scenarios
- **Context Tests**: State management and data flow
- **Service Tests**: API interactions and error handling
- **Hook Tests**: Custom hooks functionality

Run tests with:

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

Current test coverage: **6/7 test suites passing** with **43 total tests**.

## Code Quality

The project maintains high code quality through:

- **ESLint**: Configured for React Native with TypeScript rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Full type safety and IntelliSense
- **Pre-commit Hooks**: Automated quality checks (can be added with Husky)

## Environment Variables

All sensitive configuration is managed through environment variables:

- `EXPO_PUBLIC_API_BASE_URL`: Base URL for the FotoOwl API
- `EXPO_PUBLIC_API_KEY`: Your FotoOwl API key
- `EXPO_PUBLIC_EVENT_ID`: Event ID for image fetching

See `.env.example` for the complete list of required variables.

## Known Limitations

### Current Limitations

1. **Image Modal Gestures**: Complex gesture handling (zoom/pan/swipe) requires additional React Native gesture handler mocking for complete test coverage.

2. **Offline Support**: The app requires internet connectivity. Images are cached but no offline-first architecture is implemented.

3. **Image Upload**: Currently read-only application - no image upload functionality.

4. **Advanced Search**: Basic keyword search only - no advanced filters (date range, image type, etc.).

5. **Social Features**: No user authentication, sharing between users, or collaborative features.

6. **Platform-Specific Optimizations**: Generic implementation without platform-specific optimizations for iOS/Android differences.

### Known Issues

- ImageModal test suite requires additional mocking for React Native gesture handlers
- Some ESLint warnings for hardcoded color literals (can be moved to theme system)
- Minor TypeScript strict mode warnings in test files

## Next Steps & Roadmap

### Short Term (Next Release)

- [ ] Complete ImageModal test coverage
- [ ] Implement pull-to-refresh functionality
- [ ] Add image loading error states and retry mechanisms
- [ ] Enhance accessibility features (screen reader support, keyboard navigation)
- [ ] Add image metadata display (EXIF data, file size, dimensions)

### Medium Term

- [ ] Implement offline-first architecture with local database
- [ ] Add advanced search and filtering options
- [ ] Implement user authentication and profiles
- [ ] Add image upload and user-generated content
- [ ] Social features (comments, likes, sharing)
- [ ] Push notifications for new images

### Long Term

- [ ] AI-powered image tagging and search
- [ ] Advanced editing capabilities
- [ ] Multi-language support (i18n)
- [ ] Desktop version (React Native Windows/macOS)
- [ ] Progressive Web App (PWA) support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests and linting (`npm run ci`)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:

- Create an issue in this repository
- Contact the development team

---

Built with ❤️ using React Native and Expo
# login
# login
