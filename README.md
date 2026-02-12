# Express Delivery Management System

A comprehensive web application for managing express delivery operations with **enterprise-grade RBAC security** and Firebase backend integration.

## 🎯 Key Features

- **Comprehensive RBAC System** with 33 roles, 5 authority levels (L0-L5), and 5 data scopes (S1-S5)
- **Screen-Level Permissions** covering 50+ operational screens with granular access control
- **API-Level Security** with scoped permissions for all backend operations
- **Segregation of Duties (SoD)** enforcement preventing approval of own work
- **Immutable Audit Trail** with complete action logging and compliance reporting
- **Real-time Operations** with scope-based data filtering and PII masking
- **Approval Workflows** with configurable thresholds and dual approval requirements
- **Policy Enforcement** including COD submit locks, scan event immutability, and export restrictions

## 🏗️ Architecture Overview

### Comprehensive Role Matrix
- **External Users (L0)**: CUS, MER, INT
- **Operational Staff (L1)**: CSA, CCA, CUR, HSC, CSH  
- **Supervisory Staff (L2)**: DSP, HSP, FLM, BIL, AR, CLM, HRO
- **Management Staff (L3)**: BMG, ROM
- **Department Heads (L4)**: FINM, CAP, HRM
- **System Level (L5)**: AUD, SYS

### Data Scopes & Access Control
- **S1 (Self)**: Personal data only
- **S2 (Team)**: Team-level access  
- **S3 (Branch/Hub)**: Branch operations
- **S4 (Region)**: Regional management
- **S5 (Company)**: Enterprise-wide access

## 🛡️ Security & Compliance Features

### Enterprise-Grade RBAC
- **33 Distinct Roles** with hierarchical permissions (L0-L5)
- **Screen-Level Access Control** for 50+ operational screens
- **API-Level Security** with scoped token permissions
- **Data Scope Enforcement** (Self, Team, Branch, Region, Company)
- **Field-Level Security** with automatic PII masking

### Policy Enforcement
- **Immutable Events**: Scan events, COD submissions cannot be edited
- **Segregation of Duties**: Users cannot approve their own work
- **Approval Workflows**: Configurable thresholds with dual approval
- **Export Controls**: Watermarked exports with audit logging
- **Session Management**: Automatic timeout and re-authentication

### Audit & Compliance
- **Complete Audit Trail**: Every action logged with user, timestamp, details
- **Compliance Reporting**: Role-based access to audit data
- **Data Retention**: Configurable retention policies
- **Access Monitoring**: Real-time tracking of user activities
- **Incident Response**: Automated alerts for security violations

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS v4 + shadcn/ui  
- **Backend**: Firebase (Firestore + Authentication + Storage)
- **Security**: Comprehensive Firestore security rules with RBAC
- **State Management**: Enhanced React Context with RBAC hooks
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form + Zod validation
- **Animation**: Framer Motion
## 📋 Comprehensive RBAC Implementation

This system implements a **granular RBAC specification** based on express delivery industry requirements:

### Screen-Based Permissions (50+ Screens)
- **External Portal** (EXT-01 to EXT-09): Customer and merchant self-service
- **Booking & Shipments** (OPS-01 to OPS-07): Counter operations and shipment lifecycle
- **Pickup & Dispatch** (PUP-01 to PUP-06): Route planning and courier assignment
- **Hub Operations** (HUB-01 to HUB-07): Scanning, sorting, and bag control
- **Finance Operations** (FIN-01 to FIN-06, BILL-01 to BILL-06): COD, billing, AR management
- **Claims & Disputes** (CLM-01 to CLM-04): Exception handling and settlements
- **HR & Workforce** (HR-01 to HR-07): Employee management and KPI tracking
- **Administration** (ADM-01 to ADM-06): System configuration and user management

### API Permission Groups
- **Public APIs**: Tracking, portal operations
- **Core Operations**: Shipments, scans, pickups, runsheets
- **Finance APIs**: COD, cash, settlements, invoicing, AR
- **Support APIs**: Tickets, claims, disputes
- **Admin APIs**: HR, fleet, reporting, RBAC management

### Policy Rules Implementation
1. **Scan events immutable**: No edit/delete; only compensating events
2. **COD submit lock**: Courier cannot edit after submission
3. **Price override approval**: Requires manager/finance approval above threshold
4. **Segregation of Duties**: Creator cannot approve (except SYS role)
5. **PII masking**: Hub/transport roles see masked personal data
6. **Export restrictions**: Separate permission with watermarking and audit

For detailed RBAC documentation, see [RBAC_DOCUMENTATION.md](./RBAC_DOCUMENTATION.md)

## 🔧 Setup Instructions

### 3. Environment Configuration

Create `.env` file from the example:
```bash
cp .env.example .env
```

Update `.env` with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Initialize Firebase CLI (Optional)

```bash
npm install -g firebase-tools
firebase login
firebase init
```

### 5. Seed Database (Optional)

Run the seeding script to populate initial data:
```bash
npm run seed-db
```

### 6. Development

Start the development server:
```bash
npm run dev
```

## 🔐 Firestore Security Rules

The application uses comprehensive Firestore security rules that implement:

- **Role-based access control** with multiple user roles
- **Position-based permissions** (branch_manager, supervisor, data_registerer)
- **Resource-specific access rules** for users and shipments
- **Field-level security** for sensitive operations
- **Audit trail enforcement**

### User Roles

- `super_admin`: Full system access
- `admin`: Administrative access (cannot manage super_admins)
- `manager`: Team and branch management
- `customer_service`: Shipment creation and customer support
- `warehouse`: Warehouse operations and scanning
- `rider`: Delivery operations for assigned shipments
- `dispatch`: Route planning and rider assignment
- `accountant`: Financial data and billing
- `hr`: Human resources management
- `qa`: Quality assurance and auditing
- `bi_analyst`: Business intelligence and reporting

### Key Security Features

1. **User Authentication**: All operations require authentication
2. **Active Status Check**: Only active users can perform operations
3. **Role Hierarchy**: Super admin > Admin > Role-specific permissions
4. **Self-Service**: Users can update their own non-sensitive data
5. **Audit Trail**: All changes are logged with user and timestamp
6. **Field Restrictions**: Sensitive fields require appropriate permissions

## 📱 User Interface

### Dashboard Views by Role

- **Admin/Manager**: Complete system overview with KPIs
- **Customer Service**: Shipment creation and tracking
- **Warehouse**: Scanning and inventory management
- **Rider**: Assigned deliveries and POD capture
- **Dispatch**: Route planning and assignment
- **Accountant**: Financial reports and billing

### Mobile-First Design

- Responsive design for all screen sizes
- Touch-optimized interfaces for mobile users
- Offline-capable scanning for couriers
- Real-time updates and notifications

## 🔄 Real-time Features

- **Live shipment tracking** with status updates
- **Real-time notifications** for status changes
- **Live dashboard metrics** and KPIs
- **Instant messaging** for operational coordination

## 📊 Reporting & Analytics

- **Operational KPIs**: Delivery rates, SLA compliance, exceptions
- **Financial Reports**: Revenue, COD reconciliation, AR aging
- **Performance Analytics**: Rider performance, hub efficiency
- **Custom Dashboards**: Role-specific data visualization

## 🚛 Operations Workflow

1. **Shipment Creation**: Multi-channel booking with validation
2. **Pickup Management**: Assignment and scheduling
3. **Hub Operations**: Scanning, sorting, and bagging
4. **Linehaul Transport**: Trip planning and tracking
5. **Last-mile Delivery**: Route optimization and POD
6. **Returns Processing**: RTO and exception handling
7. **Financial Settlement**: COD processing and billing

## 🔒 Security Features

- **Firebase Authentication** with email/password
- **Firestore Security Rules** with role-based access
- **Data encryption** in transit and at rest
- **Audit logging** for all sensitive operations
- **Session management** with automatic timeout
- **PII protection** with field-level masking

## 🛠️ Development Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run lint

# Firebase emulators (development)
firebase emulators:start

# Deploy to Firebase
firebase deploy
```

## 📝 Sample Login Credentials (Comprehensive RBAC)

After running the seed script, you can test with these role-based accounts:

### System & Management Level
- **System Admin (SYS)**: admin@expressdelivery.com / admin123
- **Auditor (AUD)**: auditor@expressdelivery.com / audit123
- **Finance Manager (FINM)**: finance@expressdelivery.com / finance123
- **HR Manager (HRM)**: hr@expressdelivery.com / hr123
- **Claims Approver (CAP)**: claims@expressdelivery.com / claims123

### Branch & Regional Management
- **Branch Manager (BMG)**: manager@expressdelivery.com / manager123
- **Regional Operations Manager (ROM)**: rom@expressdelivery.com / rom123

### Operational Staff
- **Customer Service Agent (CSA)**: cs@expressdelivery.com / cs123
- **Customer Care Agent (CCA)**: care@expressdelivery.com / care123
- **Dispatcher (DSP)**: dispatch@expressdelivery.com / dispatch123
- **Hub Supervisor (HSP)**: hubsup@expressdelivery.com / hubsup123
- **Hub Staff (HSC)**: hubstaff@expressdelivery.com / hubstaff123
- **Courier (CUR)**: rider1@expressdelivery.com / rider123
- **Cashier (CSH)**: cashier@expressdelivery.com / cashier123

### Specialized Roles
- **Billing Officer (BIL)**: billing@expressdelivery.com / billing123
- **AR Officer (AR)**: ar@expressdelivery.com / ar123
- **Claims Officer (CLM)**: claimsoff@expressdelivery.com / claimsoff123
- **Fleet Manager (FLM)**: fleet@expressdelivery.com / fleet123
- **HR Officer (HRO)**: hro@expressdelivery.com / hro123

### External Users
- **Merchant (MER)**: merchant@example.com / merchant123
- **Customer (CUS)**: customer@example.com / customer123

Each role has specific permissions and data scope access as defined in the comprehensive RBAC matrix.
- **Warehouse**: warehouse@expressdelivery.com / warehouse123
- **Dispatch**: dispatch@expressdelivery.com / dispatch123
- **Customer Service**: cs@expressdelivery.com / cs123

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ for efficient express delivery operations.#   b e d a  
 