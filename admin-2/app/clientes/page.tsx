'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useUser } from '@clerk/nextjs';

interface Cliente {
  id: string;
  nombre: string;
  email: string;
  ciudadId: string;
  ciudad: {
    nombre: string;
  };
}

export default function Clientes() {
  const { user } = useUser();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCliente, setCurrentCliente] = useState<Partial<Cliente>>({});

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    const response = await fetch('/api/clientes');
    const data = await response.json();
    setClientes(data);
  };

  const handleOpenDialog = (cliente?: Cliente) => {
    setCurrentCliente(cliente || {});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCliente({});
  };

  const handleSaveCliente = async () => {
    if (currentCliente.id) {
      await fetch('/api/clientes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentCliente),
      });
    } else {
      await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentCliente),
      });
    }
    handleCloseDialog();
    fetchClientes();
  };

  const handleDeleteCliente = async (id: string) => {
    await fetch(`/api/clientes?id=${id}`, { method: 'DELETE' });
    fetchClientes();
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Clientes
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} style={{ marginBottom: '1rem' }}>
        Nuevo Cliente
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ciudad</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.nombre}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>{cliente.ciudad.nombre}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDialog(cliente)}>Editar</Button>
                  <Button onClick={() => handleDeleteCliente(cliente.id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentCliente.id ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            fullWidth
            value={currentCliente.nombre || ''}
            onChange={(e) => setCurrentCliente({ ...currentCliente, nombre: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={currentCliente.email || ''}
            onChange={(e) => setCurrentCliente({ ...currentCliente, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Ciudad ID"
            fullWidth
            value={currentCliente.ciudadId || ''}
            onChange={(e) => setCurrentCliente({ ...currentCliente, ciudadId: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveCliente}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}