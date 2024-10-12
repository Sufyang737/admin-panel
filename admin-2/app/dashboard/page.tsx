import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Layout from '../../components/Layout';
import { Typography, Button, Grid } from '@mui/material';
import Link from 'next/link';

export default function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Button component={Link} href="/movimientos" variant="contained" fullWidth>
            Movimientos
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button component={Link} href="/personas" variant="contained" fullWidth>
            Personas
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button component={Link} href="/clientes" variant="contained" fullWidth>
            Clientes
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button component={Link} href="/empleados" variant="contained" fullWidth>
            Empleados
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button component={Link} href="/eventos" variant="contained" fullWidth>
            Eventos
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
}