import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Firebase configuration (use your actual config)
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "express-delivery-demo.firebaseapp.com",
  projectId: "express-delivery-demo",
  storageBucket: "express-delivery-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Sample users data
const sampleUsers = [
  {
    id: 'admin-001',
    email: 'admin@expressdelivery.com',
    password: 'admin123',
    name: 'System Administrator',
    role: 'admin',
    position: 'system_admin',
    status: 'active',
    branch_location: 'HQ',
    phone: '+1234567890',
  },
  {
    id: 'manager-001',
    email: 'manager@expressdelivery.com',
    password: 'manager123',
    name: 'Branch Manager',
    role: 'manager',
    position: 'branch_manager',
    status: 'active',
    branch_location: 'Branch-001',
    phone: '+1234567891',
  },
  {
    id: 'rider-001',
    email: 'rider1@expressdelivery.com',
    password: 'rider123',
    name: 'John Rider',
    role: 'rider',
    position: 'delivery_rider',
    status: 'active',
    branch_location: 'Branch-001',
    phone: '+1234567892',
  },
  {
    id: 'warehouse-001',
    email: 'warehouse@expressdelivery.com',
    password: 'warehouse123',
    name: 'Warehouse Staff',
    role: 'warehouse',
    position: 'warehouse_operator',
    status: 'active',
    branch_location: 'Branch-001',
    phone: '+1234567893',
  },
  {
    id: 'dispatch-001',
    email: 'dispatch@expressdelivery.com',
    password: 'dispatch123',
    name: 'Dispatch Coordinator',
    role: 'dispatch',
    position: 'dispatch_coordinator',
    status: 'active',
    branch_location: 'Branch-001',
    phone: '+1234567894',
  },
  {
    id: 'cs-001',
    email: 'cs@expressdelivery.com',
    password: 'cs123',
    name: 'Customer Service',
    role: 'customer_service',
    position: 'customer_service_rep',
    status: 'active',
    branch_location: 'Branch-001',
    phone: '+1234567895',
  },
];

// Sample shipments data
const sampleShipments = [
  {
    awb: 'EDS2026011001',
    status: 'created',
    sender: {
      name: 'Alice Johnson',
      addressLine1: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '+1234567896',
    },
    receiver: {
      name: 'Bob Smith',
      addressLine1: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
      phone: '+1234567897',
    },
    serviceType: 'Express',
    weight: 2.5,
    dimensions: {
      length: 30,
      width: 20,
      height: 15,
    },
    volumetricWeight: 1.8,
    codAmount: 0,
    currency: 'USD',
    isPaid: true,
    estimatedDelivery: new Date(Date.now() + 86400000 * 2).toISOString(),
    history: [
      {
        status: 'created',
        timestamp: new Date().toISOString(),
        location: 'Branch-001',
        notes: 'Shipment created',
        userId: 'cs-001',
      }
    ],
    createdBy: 'cs-001',
  },
  {
    awb: 'EDS2026011002',
    status: 'picked_up',
    sender: {
      name: 'Carol Davis',
      addressLine1: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
      phone: '+1234567898',
    },
    receiver: {
      name: 'David Wilson',
      addressLine1: '321 Elm St',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA',
      phone: '+1234567899',
    },
    serviceType: 'Standard',
    weight: 1.2,
    dimensions: {
      length: 25,
      width: 15,
      height: 10,
    },
    volumetricWeight: 0.75,
    codAmount: 150.00,
    currency: 'USD',
    isPaid: false,
    estimatedDelivery: new Date(Date.now() + 86400000 * 3).toISOString(),
    assigned_rider: 'rider-001',
    history: [
      {
        status: 'created',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        location: 'Branch-001',
        notes: 'Shipment created',
        userId: 'cs-001',
      },
      {
        status: 'picked_up',
        timestamp: new Date().toISOString(),
        location: 'Pickup Location',
        notes: 'Package picked up by rider',
        userId: 'rider-001',
      }
    ],
    createdBy: 'cs-001',
  },
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create users
    console.log('👥 Creating users...');
    for (const userData of sampleUsers) {
      try {
        // Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );
        
        // Create Firestore user document
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          position: userData.position,
          status: userData.status,
          branch_location: userData.branch_location,
          phone: userData.phone,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        console.log(`✅ Created user: ${userData.name} (${userData.email})`);
      } catch (error) {
        console.error(`❌ Failed to create user ${userData.email}:`, error);
      }
    }

    // Create shipments
    console.log('📦 Creating shipments...');
    for (let i = 0; i < sampleShipments.length; i++) {
      const shipmentData = sampleShipments[i];
      const shipmentRef = doc(collection(db, 'shipments'));
      
      await setDoc(shipmentRef, {
        ...shipmentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log(`✅ Created shipment: ${shipmentData.awb}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('Admin: admin@expressdelivery.com / admin123');
    console.log('Manager: manager@expressdelivery.com / manager123');
    console.log('Rider: rider1@expressdelivery.com / rider123');
    console.log('Warehouse: warehouse@expressdelivery.com / warehouse123');
    console.log('Dispatch: dispatch@expressdelivery.com / dispatch123');
    console.log('Customer Service: cs@expressdelivery.com / cs123');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  }
}

// Run the seeding script
seedDatabase();