# 🌊 Scuba Diving Simulation Dashboard

A professional React-based dashboard for scuba diving training and simulation. Features real-time gauges, physics-based calculations, and comprehensive dive analytics.

## ✨ Features

### 🎛️ Dual Operation Modes
- **Manual Mode**: Direct control of all gauge values for training scenarios
- **Auto Mode**: Physics-based simulation with realistic dive profiles

### 📊 Real-Time Gauges
- **Umbilical Pressure**: Surface supply pressure monitoring (0-30 bar)
- **Diver Pressure**: Individual diver pressure readings with depth compensation
- **Cylinder Volume**: Air supply levels with color-coded warnings (0-100%)
- **Dive Time Remaining**: Calculated based on consumption rates and air supply

### 📈 Analytics & Monitoring
- **Computed Metrics**: Ambient pressure, total air consumption, remaining dive time
- **Historical Charts**: Depth and pressure trends over time
- **Alert System**: Real-time warnings for low air, pressure drops, and emergency situations

### 🔧 Advanced Simulation
- **Realistic Dive Profiles**: 60-minute compressed dive simulation
- **Physics Calculations**: Depth-based pressure changes and air consumption
- **Emergency Scenarios**: Leak simulation and emergency response training

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Node.js Installation

If you don't have Node.js installed, follow these steps:

#### Windows
1. **Download Node.js**:
   - Visit [nodejs.org](https://nodejs.org/)
   - Download the LTS version (recommended)
   - Run the installer and follow the setup wizard

2. **Verify Installation**:
   ```bash
   node --version
   npm --version
   ```

#### macOS
**Option 1: Official Installer**
1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS version for macOS
3. Run the `.pkg` installer

**Option 2: Using Homebrew** (recommended)
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node
```

**Option 3: Using MacPorts**
```bash
sudo port install nodejs18 +universal
```

#### Linux (Ubuntu/Debian)
**Option 1: Using NodeSource Repository** (recommended)
```bash
# Update package index
sudo apt update

# Install curl if not already installed
sudo apt install -y curl

# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs
```

**Option 2: Using Snap**
```bash
sudo snap install node --classic
```

**Option 3: Using Package Manager**
```bash
sudo apt update
sudo apt install nodejs npm
```

#### Linux (CentOS/RHEL/Fedora)
**Using DNF/YUM:**
```bash
# Fedora
sudo dnf install nodejs npm

# CentOS/RHEL
sudo yum install nodejs npm
```

#### Using Node Version Manager (NVM) - All Platforms
NVM allows you to install and manage multiple Node.js versions:

**Install NVM:**
```bash
# Linux/macOS
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
source ~/.bashrc
```

**Install and use Node.js:**
```bash
# Install latest LTS version
nvm install --lts

# Use the installed version
nvm use --lts

# Set as default
nvm alias default node
```

#### Verify Installation
After installation, verify Node.js and npm are working:
```bash
node --version    # Should show v16.x.x or higher
npm --version     # Should show npm version
```

### Project Installation
```bash
# Clone the repository
git clone <repository-url>
cd scuba-diving-dashboard

# Install dependencies
npm install

# Start development server
npm start
```

### Usage
1. **Manual Mode**: Use the control panel to manually adjust gauge values
2. **Auto Mode**: Start the simulation to see realistic dive progression
3. **Emergency Training**: Use the "Trigger Leak" button to simulate emergency scenarios
4. **Analytics**: Monitor dive metrics and historical data in real-time

### Troubleshooting Node.js Installation

#### Common Issues and Solutions

**1. Permission Errors (Linux/macOS)**
```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

**2. Node.js Command Not Found**
- Restart your terminal/command prompt
- Check if Node.js is in your PATH:
  ```bash
  echo $PATH  # Linux/macOS
  echo %PATH% # Windows
  ```
- Reinstall Node.js if the issue persists

**3. Version Conflicts**
```bash
# Clear npm cache
npm cache clean --force

# Update npm to latest version
npm install -g npm@latest
```

**4. Windows Execution Policy Issues**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**5. Alternative Package Managers**
If npm doesn't work, try yarn:
```bash
# Install yarn globally
npm install -g yarn

# Use yarn instead of npm
yarn install
yarn start
```

#### System Requirements
- **Minimum**: Node.js 16.x, 4GB RAM, 1GB free disk space
- **Recommended**: Node.js 18.x+, 8GB RAM, 2GB free disk space
- **Supported OS**: Windows 10+, macOS 10.15+, Ubuntu 18.04+

## 🏗️ Architecture

### Core Components
- **Dashboard**: Main layout and component orchestration
- **GaugeGrid**: Real-time gauge display system
- **ControlPanel**: Manual controls and simulation management
- **Analytics**: Metrics calculation and data visualization
- **AlertSystem**: Real-time warning and notification system

### State Management
- **Zustand Store**: Centralized state management with computed values
- **Simulation Engine**: Physics-based updates and realistic dive profiles
- **Historical Data**: Time-series data for charts and analysis

### Key Technologies
- **React 18**: Modern React with hooks and functional components
- **Zustand**: Lightweight state management
- **Google Charts**: Professional gauge and chart components
- **Recharts**: Advanced data visualization
- **CSS Modules**: Scoped styling system

## 🔧 Recent Improvements

### Code Cleanup & Optimization
- ✅ **Fixed `toFixed` errors** - Added proper null checks throughout the application
- ✅ **Removed over-engineered code** - Eliminated 300+ lines of unnecessary complexity
- ✅ **Simplified store logic** - Consolidated repetitive setter functions with helper utilities
- ✅ **Streamlined components** - Removed unused features and redundant calculations
- ✅ **Improved maintainability** - Cleaner, more focused codebase

### Performance Enhancements
- Removed unused animation components and performance monitoring hooks
- Simplified gauge components by removing unnecessary alert checking
- Optimized state updates and reduced re-renders
- Streamlined simulation engine with focused functionality

## 📁 Project Structure

```
src/
├── components/
│   ├── Analytics/          # Metrics and data visualization
│   ├── ControlPanel/       # Manual controls and simulation
│   ├── Gauges/            # Real-time gauge components
│   └── UI/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── store/                 # Zustand state management
├── utils/                 # Calculations and constants
└── styles/               # CSS and styling
```

## 🎯 Use Cases

### Training Applications
- **Dive Planning**: Practice dive profile calculations
- **Emergency Response**: Simulate equipment failures and responses
- **Equipment Familiarization**: Learn gauge reading and interpretation
- **Safety Protocols**: Practice monitoring and alert response

### Educational Features
- **Physics Demonstration**: Real-time pressure and consumption calculations
- **Data Analysis**: Historical dive data review and analysis
- **Scenario Training**: Various dive conditions and emergency situations

## 🔬 Technical Details

### Physics Calculations
- **Ambient Pressure**: `1 + Depth / 10` (bar)
- **Air Consumption**: `(Diver1Rate + Diver2Rate) × AmbientPressure` (L/min)
- **Remaining Time**: `(AvgCylinderVolume / AirConsumption) × 10` (minutes)
- **Line Loss**: Depth-based pressure reduction for diver supplies

### Simulation Parameters
- **Update Interval**: 1 second for real-time updates
- **Depth Range**: 0-40 meters
- **Pressure Range**: 0-250 bar
- **Consumption Range**: 10-50 L/min per diver

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for professional diving training and education
- Inspired by real-world diving equipment and procedures
- Designed with safety and accuracy in mind

---

**⚠️ Disclaimer**: This is a simulation tool for training purposes only. Always follow proper diving procedures and use certified equipment for actual diving operations.