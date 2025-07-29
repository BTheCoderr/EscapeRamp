# ⚡ Quick Start Guide - Escape Ramp

## 🎯 **Your Branch Assignment**

| Your Name | Your Branch | Quick Command |
|-----------|-------------|---------------|
| **Baheem** | `baheem` | `git checkout baheem` |
| **Thomas** | `thomas` | `git checkout thomas` |
| **Dante** | `dante` | `git checkout dante` |
| **Pio** | `pio` | `git checkout pio` |
| **Sean** | `sean` | `git checkout sean` |
| **Adrian** | `adrian` | `git checkout adrian` |

## 🚀 **5-Minute Setup**

### **1. Clone & Setup**
```bash
git clone https://github.com/BTheCoderr/escape-ramp.git
cd escape-ramp
npm install
```

### **2. Environment Setup**
```bash
cp .env.local.example .env.local
# Add your API keys (see SETUP.md for details)
```

### **3. Switch to Your Branch**
```bash
# Replace {your-name} with your branch from the table above
git checkout {your-name}
```

### **4. Start Development**
```bash
npm run dev
# Open http://localhost:3000
```

## 📋 **Daily Commands**

### **Start of Day**
```bash
git checkout main
git pull origin main
git checkout {your-name}
git merge main
```

### **During Work**
```bash
# Make changes, then:
git add .
git commit -m "feat: your change description"
git push origin {your-name}
```

### **End of Day**
```bash
git pull origin main
git merge main
git push origin {your-name}
```

## 🎯 **Your Focus Areas**

### **Baheem (Team Lead)**
- Project management & architecture decisions
- Code reviews & final approvals
- Sprint planning & task assignment

### **Thomas (Frontend - UI/UX)**
- Dashboard components & layout
- User experience & navigation
- Responsive design & mobile optimization

### **Dante (Backend - API/Database)**
- RESTful API endpoints
- Database schema & migrations
- Authentication & security

### **Pio (Full Stack - Integration)**
- Frontend-backend integration
- Testing & CI/CD pipeline
- Error tracking & monitoring

### **Sean (Frontend - Analytics)**
- Analytics dashboard & charts
- Custom report builder
- Data visualization & metrics

### **Adrian (Backend - AI/Services)**
- Claude AI integration
- Microservices architecture
- Data processing & migrations

## 🔗 **Important Links**

- **Repository**: https://github.com/BTheCoderr/escape-ramp
- **Detailed Setup**: `SETUP.md`
- **Team Guide**: `TEAM_COLLABORATION.md`
- **API Docs**: Check `/src/app/api/` routes

## 🆘 **Need Help?**

1. **Check SETUP.md** for detailed instructions
2. **Ask in team chat** for quick questions
3. **Create GitHub issue** for bugs
4. **Schedule call** for complex discussions

---

**Ready to code? Let's build something amazing! 🚀** 