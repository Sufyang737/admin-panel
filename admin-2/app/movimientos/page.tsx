'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useUser } from '@clerk/nextjs';

interface Movimiento {
  id: string;
  monto: number;
  moneda: 'USD' | 'ARS';
  categoria: { nombre: string };
  subcategoria: { nombre: string };
  detalle: { nombre: string };
  ingreso: boolean;
  fechaProgramado: string;
  fechaRecibido: string | null;
}

export default function Movimientos() {
  const { user } = useUser();
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentMovimiento, setCurrentMovimiento] = useState<Partial<Movimiento>>({});

  useEffect(() => {
    fetchMovimientos();
  }, []);

  const fetchMovimientos = async () => {
    const response = await fetch('/api/movimientos');
    const data = await response.json();
    setMovimientos(data);
  };

  const handleOpenDialog = (movimiento?: Movimiento) => {
    setCurrentMovimiento(movimiento || {});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentMovimiento({});
  };

  const handleSaveMovimiento = async () => {
    if (currentMovimiento.id) {
      await fetch('/api/movimientos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentMovimiento),
      });
    } else {
      await fetch('/api/movimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentMovimiento),
      });
    }
    handleCloseDialog();
    fetchMovimientos();
  };

  const handleDeleteMovimiento = async (id: string) => {
    await fetch(`/api/movimientos?id=${id}`, { method: 'DELETE' });
    fetchMovimientos();
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Movimientos
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} style={{ marginBottom: '1rem' }}>
        Nuevo Movimiento
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Monto</TableCell>
              <TableCell>Moneda</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Subcategoría</TableCell>
              <TableCell>Detalle</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Fecha Programada</TableCell>
              <TableCell>Fecha Recibida</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movimientos.map((movimiento) => (
              <TableRow key={movimiento.id}>
                <TableCell>{movimiento.monto}</TableCell>
                <TableCell>{movimiento.moneda}</TableCell>
                <TableCell>{movimiento.categoria.nombre}</TableCell>
                <TableCell>{movimiento.subcategoria.nombre}</TableCell>
                <TableCell>{movimiento.detalle.nombre}</TableCell>
                <TableCell>{movimiento.ingreso ? 'Ingreso' : 'Egreso'}</TableCell>
                <TableCell>{new Date(movimiento.fechaProgramado).toLocaleDateString()}</TableCell>
                <TableCell>{movimiento.fechaRecibido ? new Date(movimiento.fechaRecibido).toLocaleDateString() : 'Pendiente'}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDialog(movimiento)}>Editar</Button>
                  <Button onClick={() => handleDeleteMovimiento(movimiento.id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentMovimiento.id ? 'Editar Movimiento' : 'Nuevo Movimiento'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Monto"
            type="number"
            fullWidth
            value={currentMovimiento.monto || ''}
            onChange={(e) => setCurrentMovimiento({ ...currentMovimiento, monto: parseFloat(e.target.value) })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Moneda</InputLabel>
            <Select
              value={currentMovimiento.moneda || ''}
              onChange={(e) => setCurrentMovimiento({ ...currentMovimiento, moneda: e.target.value as 'USD' | 'ARS' })}
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="ARS">ARS</MenuItem>
            </Select>
          </FormControl>
          {/* Aquí deberías agregar más campos para categoría, subcategoría, detalle, etc. */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Tipo</InputLabel>
            <Select
              value={currentMovimiento.ingreso === undefined ? '' : (currentMovimiento.ingreso ? 'ingreso' : 'egreso')}
              onChange={(e) => setCurrentMovimiento({ ...currentMovimiento, ingreso: e.target.value === 'ingreso' })}
            >
              <MenuItem value="ingreso">Ingreso</MenuItem>
              <MenuItem value="egreso">Egreso</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Fecha Programada"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={currentMovimiento.fechaProgramado || ''}
            onChange={(e) => setCurrentMovimiento({ ...currentMovimiento, fechaProgramado: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Fecha Recibida"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={currentMovimiento.fechaRecibido || ''}
            onChange={(e) => setCurrentMovimiento({ ...currentMovimiento, fechaRecibido: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveMovimiento}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}