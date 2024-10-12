import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const role = user?.publicMetadata.role as string;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gestión de Eventos y Finanzas
          </Typography>
          {role === 'ADMIN' || role === 'DEV' ? (
            <>
              <Button color="inherit" component={Link} href="/movimientos">Movimientos</Button>
              <Button color="inherit" component={Link} href="/personas">Personas</Button>
              <Button color="inherit" component={Link} href="/clientes">Clientes</Button>
              <Button color="inherit" component={Link} href="/empleados">Empleados</Button>
              <Button color="inherit" component={Link} href="/eventos">Eventos</Button>
            </>
          ) : role === 'CONTABLE' ? (
            <Button color="inherit" component={Link} href="/movimientos">Movimientos</Button>
          ) : (
            <>
              <Button color="inherit" component={Link} href="/personas">Personas</Button>
              <Button color="inherit" component={Link} href="/clientes">Clientes</Button>
              <Button color="inherit" component={Link} href="/eventos">Eventos</Button>
            </>
          )}
          <UserButton afterSignOutUrl="/" />
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;