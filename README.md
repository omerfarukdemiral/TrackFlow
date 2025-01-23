# TrackFlow 🔍

> A powerful web analytics solution that provides real-time user behavior tracking, heatmaps, and comprehensive analytics through a Chrome extension, modern dashboard, and scalable backend.

TrackFlow empowers businesses to understand their users better by capturing clicks, movements, and interactions in real-time, transforming raw data into actionable insights through beautiful visualizations and detailed analytics.

## 🌟 Key Features

### Chrome Extension
- Real-time user interaction tracking
- Page view duration monitoring
- Minimal performance impact
- Privacy-focused data collection

### Analytics Dashboard
- Built with Next.js for optimal performance
- Real-time analytics visualization
- Interactive heatmaps
- Advanced filtering capabilities
- Customizable reporting

### Backend API
- Express.js-based RESTful architecture
- Firebase integration for scalability
- Secure data storage
- Real-time data processing

## 🚀 Getting Started

### Prerequisites
- Node.js >= 16.x
- npm >= 8.x
- Firebase account
- Chrome browser

### Installation

**Extension Setup**
```bash
cd extension
npm install
npm run build
```

**Dashboard Setup**
```bash
cd panel
npm install
npm run dev
```

**Backend Setup**
```bash
cd backend
npm install
npm run dev
```

## ⚙️ Environment Configuration

Configure your environment variables for each component:

**Backend (.env)**
```
PORT=3001
FIREBASE_PROJECT_ID=your-project-id
```

**Dashboard (.env.local)**
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

## 📚 Documentation

For detailed documentation, please refer to the `docs` directory.

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔒 Security

TrackFlow takes privacy and security seriously. All data collection complies with GDPR and CCPA requirements.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌟 Support

If you find TrackFlow useful, please consider giving it a star ⭐️

---
Made with ❤️ by OFD