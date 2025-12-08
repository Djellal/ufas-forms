import { db } from './src/lib/server/db';
import { user } from './src/lib/server/db/schema';
import { hashPassword } from './src/lib/server/auth';

async function createAdminUser() {
  try {
    // Hash a default password for the admin user
    const hashedPassword = await hashPassword('admin123');
    
    // Create an admin user
    const adminUser = await db.insert(user).values({
      id: 'admin-user-id',
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    }).returning();
    
    console.log('Admin user created successfully:', adminUser);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();