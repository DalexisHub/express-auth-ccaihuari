import bcrypt from 'bcrypt';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

export default async function seedUsers() {
    const adminEmail = 'admin@demo.com';
    const existingAdmin = await userRepository.findByEmail(adminEmail);

    if (existingAdmin) {
        console.log('Admin user already exists');
        return;
    }

    let adminRole = await roleRepository.findByName('admin');

    if (!adminRole) {
        adminRole = await roleRepository.create({ name: 'admin' });
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
    const hashedPassword = await bcrypt.hash('Admin123@', saltRounds);

    await userRepository.create({
        email: adminEmail,
        password: hashedPassword,
        name: 'Administrador',
        lastName: 'Principal',
        phoneNumber: '999999999',
        birthdate: new Date('1995-01-01'),
        url_profile: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        adress: 'Lima, Perú',
        roles: [adminRole._id]
    });

    console.log('Seeded admin user: admin@demo.com / Admin123@');
}