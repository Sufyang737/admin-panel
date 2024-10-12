'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useUser } from '@clerk/nextjs';

interface Persona {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  email: string | null;
  cumpleanos: string | null;
  eventoCalendarioId: string | null;
  clienteId: string | null;
}

export default function Personas() {
  const { user } = useUser();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<Partial<Persona>>({});

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    const response = await fetch('/api/personas');
    const data = await response.json();
    setPersonas(data);
  };

  const handleOpenDialog = (persona?: Persona) => {
    setCurrentPersona(persona || {});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentPersona({});
  };

  const handleSavePersona = async () => {
    if (currentPersona.id) {
      await fetch('/api/personas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPersona),
      });
    } else {
      await fetch('/api/personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPersona),
      });
    }
    handleCloseDialog();
    fetchPersonas();
  };

  const handleDeletePersona = async (id: string) => {
    await fetch(`/api/personas?id=${id}`, { method: 'DELETE' });
    fetchPersonas();
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Personas
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} style={{ marginBottom: '1rem' }}>
        Nueva Persona
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Cumpleaños</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {personas.map((persona) => (
              <TableRow key={persona.id}>
                <TableCell>{persona.nombre}</TableCell>
                <TableCell>{persona.apellido}</TableCell>
                <TableCell>{persona.telefono}</TableCell>
                <TableCell>{persona.email}</TableCell>
                <TableCell>{persona.cumpleanos ? new Date(persona.cumpleanos).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDialog(persona)}>Editar</Button>
                  <Button onClick={() => handleDeletePersona(persona.id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentPersona.id ? 'Editar Persona' : 'Nueva Persona'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            fullWidth
            value={currentPersona.nombre || ''}
            onChange={(e) => setCurrentPersona({ ...currentPersona, nombre: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Apellido"
            fullWidth
            value={currentPersona.apellido || ''}
            onChange={(e) => setCurrentPersona({ ...currentPersona, apellido: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Teléfono"
            fullWidth
            value={currentPersona.telefono || ''}
            onChange={(e) => setCurrentPersona({ ...currentPersona, telefono: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={currentPersona.email || ''}
            onChange={(e) => setCurrentPersona({ ...currentPersona, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Cumpleaños"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={currentPersona.cumpleanos || ''}
            onChange={(e) => setCurrentPersona({ ...currentPersona, cumpleanos: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSavePersona}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}