import bcrypt from 'bcryptjs';

// For demo purposes, we'll just generate the hashed passwords
// In production, you would use Supabase client to insert users

const users = [
  {
    id: '880e8400-e29b-41d4-a716-446655440001',
    email: 'admin@rokacoffee.com',
    password: '123456',
    full_name: 'Administrator',
    role: 'admin' as const,
    is_active: true,
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440002',
    email: 'cashier@rokacoffee.com',
    password: '123456',
    full_name: 'Cashier Staff',
    role: 'cashier' as const,
    is_active: true,
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440003',
    email: 'kitchen@rokacoffee.com',
    password: '123456',
    full_name: 'Kitchen Staff',
    role: 'kitchen' as const,
    is_active: true,
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440004',
    email: 'manager@rokacoffee.com',
    password: '123456',
    full_name: 'Manager',
    role: 'manager' as const,
    is_active: true,
  },
];

async function seedUsers() {
  console.log('🌱 Generating user password hashes...');

  for (const user of users) {
    try {
      // Hash password
      const passwordHash = await bcrypt.hash(user.password, 10);

      console.log(`✅ Generated hash for: ${user.email} (${user.role})`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Hash: ${passwordHash}`);
      console.log('');
    } catch (error) {
      console.error(`❌ Error processing user ${user.email}:`, error);
    }
  }

  console.log('🎉 Password hash generation completed!');
  console.log('\n📋 Demo credentials:');
  console.log('Admin: admin@rokacoffee.com / 123456');
  console.log('Cashier: cashier@rokacoffee.com / 123456');
  console.log('Kitchen: kitchen@rokacoffee.com / 123456');
  console.log('Manager: manager@rokacoffee.com / 123456');
  console.log('\n💡 Copy the hashes above to your database users table');
}

seedUsers().catch(console.error);
