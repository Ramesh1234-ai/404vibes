# Rishit Sinha - Portfolio

A modern, responsive portfolio website showcasing projects, skills, and experience. Built with React, Tailwind CSS, Vite, and Firebase.

## Features

- **Responsive Design** - Mobile-friendly portfolio that looks great on all devices
- **Smooth Animations** - Scroll animations and transitions for enhanced user experience
- **Dark/Light Theme** - Toggle between dark and light modes
- **Social Links** - Integrated social media icons (GitHub, LinkedIn, Twitter,Email)
- **Contact Form** - Firebase-integrated contact form for inquiries
- **Projects Showcase** - Display of completed projects with descriptions and links
- **Skills Section** - Organized by categories (Frontend, Backend, Tools, Database)

## Tech Stack

- **Frontend**: React, Tailwind CSS, Lucide React Icons
- **Build Tool**: Vite
- **Icons**: Font Awesome (React FontAwesome)
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS with PostCSS

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Ramesh1234-ai/404vibes.git
cd 404vibes
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase configuration in `src/App.jsx` with your credentials

4. Start the development server:
```bash
npm run dev
```

## Building for Production

```bash
npm run build
```

The optimized build will be in the `dist` folder.

## Project Structure

```
port/
├── src/
│   ├── App.jsx           # Main component
│   ├── index.css         # Global styles
│   ├── main.jsx          # Entry point
│   └── assets/           # Static assets
├── public/               # Public assets
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md             # This file
```

## Customization

- **Personal Information**: Edit portfolio data in `src/App.jsx`
- **Social Links**: Update social media URLs in the footer section
- **Styles**: Modify Tailwind classes for custom styling
- **Firebase**: Replace the Firebase config with your own credentials

## Contact

For inquiries or collaboration opportunities, use the contact form on the portfolio or reach out via:
- Email: your.email@example.com
- LinkedIn: https://linkedin.com
- GitHub: https://github.com

## License

This project is open source and available under the MIT License.
