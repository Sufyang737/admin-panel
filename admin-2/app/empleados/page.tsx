'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip } from '@mui/material';
import { useUser } from '@clerk/nextjs';

interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  roles: { rol: string }[];
}

export default function Empleados() {
  const { user } = useUser();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEmpleado, setCurrentEmpleado] = useState<Partial<Empleado>>({});

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    const response = await fetch('/api/empleados');
    const data = await response.json();
    setEmpleados(data);
  };

  const handleOpenDialog = (empleado?: Empleado) => {
    setCurrentEmpleado(empleado || { roles: [] });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentEmpleado({});
  };

  const handleSaveEmpleado = async () => {
    if (currentEmpleado.id) {
      await fetch('/api/empleados', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentEmpleado),
      });
    } else {
      await fetch('/api/empleados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentEmpleado),
      });
    }
    handleCloseDialog();
    fetchEmpleados();
  };

  const handleDeleteEmpleado = async (id: string) => {
    await fetch(`/api/empleados?id=${id}`, { method: 'DELETE' });
    fetchEmpleados();
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Empleados
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} style={{ marginBottom: '1rem' }}>
        Nuevo Empleado
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>DNI</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {empleados.map((empleado) => (
              <TableRow key={empleado.id}>
                <TableCell>{empleado.nombre}</TableCell>
                <TableCell>{empleado.apellido}</TableCell>
                <TableCell>{empleado.dni}</TableCell>
                <TableCell>{empleado.email}</TableCell>
                <TableCell>{empleado.telefono}</TableCell>
                <TableCell>
                  {empleado.roles.map((role, index) => (
                    <Chip key={index} label={role.rol} style={{ margin: '2px' }} />
                  ))}
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDialog(empleado)}>Editar</Button>
                  <Button onClick={() => handleDeleteEmpleado(empleado.id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentEmpleado.id ? 'Editar Empleado' : 'Nuevo Empleado'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            fullWidth
            value={currentEmpleado.nombre || ''}
            onChange={(e) => setCurrentEmpleado({ ...currentEmpleado, nombre: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Apellido"
            fullWidth
            value={currentEmpleado.apellido || ''}
            onChange={(e) => setCurrentEmpleado({ ...currentEmpleado, apellido: e.target.value })}
          />
          <TextField
            margin="dense"
            label="DNI"
            fullWidth
            value={currentEmpleado.dni || ''}
            onChange={(e) => setCurrentEmpleado({ ...currentEmpleado, dni: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={currentEmpleado.email || ''}
            onChange={(e) => setCurrentEmpleado({ ...currentEmpleado, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Teléfono"
            fullWidth
            value={currentEmpleado.telefono || ''}
            onChange={(e) => setCurrentEmpleado({ ...currentEmpleado, telefono: e.target.value })}
          />
          {/* Aquí deberías agregar un componente para manejar los roles */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveEmpleado}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}