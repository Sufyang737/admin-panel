'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem } from '@mui/material';
import { useUser } from '@clerk/nextjs';

interface User {
  id: string;
  email: string;
  role: string;
}

export default function AdminPanel() {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    await fetch('/api/assign-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIdToUpdate: userId, newRole }),
    });
    fetchUsers();
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Panel de Administración
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as string)}
                  >
                    <MenuItem value="ADMIN">Admin</MenuItem>
                    <MenuItem value="DEV">Dev</MenuItem>
                    <MenuItem value="CONTABLE">Contable</MenuItem>
                    <MenuItem value="DEFAULT">Default</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
}