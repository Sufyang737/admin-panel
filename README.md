### 1. **Estructura de Base de Datos**
Tendrás que crear las tablas mencionadas en tu descripción, lo que implica definir las relaciones entre ellas:

### Usuarios que van a poder ingresar a la app 

Tipos de usuarios:
	- Se loguea (todos de la empresa)
		- Contable
		- Admin (jefe)
		- dev (nachito y yo carita fecherita)
		- default 
	- No se loguea  
		- Clientes 
	
---

#### Tablas y Campos
- **persona**s (Persona fisica q son clientes) Acceden a ver este material (todos)
  - `id`: (clave primaria, auto incrementable)
  - `nombre`: (string)
  - `apellido`: (string)
  - `telefono`: (string)
  - `email`: (string)
  - `cumpleanios`: (fecha)
  - `evento_calendario_id`: (string, opcional) 
  - `cliente_id`: (FK a `cliente`)

- **cliente**
  - `id`: (clave primaria, auto incrementable)
  - `nombre`: (string)
  - `email`: (string)
  - `ciudad_id`: (FK a `ciudad`)

- **evento** (el cliente contrata un evento)
  - `id`: (clave primaria, auto incrementable)
  - `fecha`: (fecha)
  - `num_invitados`: (número)
  - `tipo_evento_id`: (id)
  - `cliente_id`: (FK a `cliente`)
  - `carpeta_id`: (string)
  - `estado`: (string)
  - `planner_id`: (FK a `empleadas`)

- **tipo de evento**
	- `id`: (clave primaria, auto incrementable)
	- `nombre`: (string)

- **empleadas** (datos del equipo completo de la empresa)
  - `id`: (clave primaria, auto incrementable)
  - `nombre`: (string)
  - `apellido`: (string)
  - `dni`: (int)
  - `email`: (string)
  - `telefono`: (string)

- **empleadas_roles** (pueden tener uno o mas roles)
  - `id`: (clave primaria, auto incrementable)
  - `personal_id`: (FK a `empleadas`)
  - `rol`: (enum: "socia", "planner", "staff", "administrativa") (nada que ver a los roles de usuario)

- **movimientos**
  - `id`: (clave primaria, auto incrementable)
  - `monto`: (decimal)
  - `moneda`: (enum: "USD", "ARS")
  - `categoria_id`: (FK a `cat_mov`)
  - `subcategoria_id`: (FK a `subcat_movimiento`)
  - `detalle_id`: (FK a `det_mov`)
  - `ingreso`: (booleano)
  - `fecha_programado`: (fecha)
  - `fecha_recibido`: (fecha)

- **cat_mov**
  - `id`: (clave primaria, auto incrementable)
  - `nombre`: (string)
  - `descripcion`: (string)

- **subcat_movimiento**
  - `id`: (clave primaria, auto incrementable)
  - `cat_mov_id`: (FK a `cat_mov`)
  - `nombre`: (string)
  - `descripcion`: (string, opcional)

- **det_mov**
  - `id`: (clave primaria, auto incrementable)
  - `subcat_mov_id`: (FK a `subcat_movimiento`)
  - `nombre`: (string)
  - `descripcion`: (string, opcional)

### 2. **Funcionalidades CRUD**
Para cada una de las entidades mencionadas, necesitarás implementar operaciones CRUD (Crear, Leer, Actualizar, Borrar). Aquí un breve resumen de cada funcionalidad:

#### **Personal**
- **Crear**: Añadir nuevos empleados al sistema.
- **Leer**: Listar todos los empleados, obtener detalles de un empleado específico.
- **Actualizar**: Modificar la información de un empleado existente.
- **Borrar**: Eliminar un empleado del sistema.

#### **Cliente**
- **Crear**: Añadir nuevos clientes.
- **Leer**: Listar todos los clientes, obtener detalles de un cliente específico.
- **Actualizar**: Modificar la información de un cliente existente.
- **Borrar**: Eliminar un cliente del sistema.

#### **Persona**
- **Crear**: Añadir nuevas personas asociadas a un cliente.
- **Leer**: Listar todas las personas, obtener detalles de una persona específica.
- **Actualizar**: Modificar la información de una persona existente.
- **Borrar**: Eliminar una persona del sistema.

#### **Evento**
- **Crear**: Añadir nuevos eventos contratados por un cliente.
- **Leer**: Listar todos los eventos, obtener detalles de un evento específico.
- **Actualizar**: Modificar la información de un evento existente.
- **Borrar**: Eliminar un evento del sistema.

#### **Movimientos**
- **Crear**: Registrar movimientos de dinero.
- **Leer**: Listar todos los movimientos, obtener detalles de un movimiento específico.
- **Actualizar**: Modificar la información de un movimiento existente.
- **Borrar**: Eliminar un movimiento del sistema.

### 3. **Interfaz de Usuario**
Deberías desarrollar una interfaz para que los usuarios interactúen con el sistema. Esto podría incluir:
- Formularios para agregar y editar datos.
- Listados para mostrar registros de clientes, empleados, eventos, etc.
- Detalles de cada registro con la opción de editar o eliminar.

### 4. **Integración y Pruebas**
- Asegúrate de integrar correctamente las funciones de la base de datos con la interfaz de usuario.
- Realiza pruebas para asegurarte de que todas las operaciones CRUD funcionan correctamente y que los datos se manejan de manera adecuada.

### 5. **Documentación**
- Documenta el código y las funcionalidades del sistema para facilitar su mantenimiento y futuras mejoras.
---
Todas las rutas necesitan login, salvo al vista de info personal del cliente.

![[ED-202409291149.excalidraw]]

Sufyan: 
	Rutas: 
		- Movimientos
		- Personas
		- Clientes
		- Empleados
		- Eventos
		- formulario cliente

---
ENV:
	UPLOADTHING_SECRET=
	UPLOADTHING_APP_ID=
	NEXTAUTH_URL = http://localhost:3000
	NEXTAUTH_SECRET=i4ZWNIJNpvSVlePlQBTRQeeFZ4SvGPlaw0Bi+MpEQCM=
	GITHUB_ID =
	GITHUB_SECRET =
	DATABASE_URL=postgresql://admin-crud_owner:2S4vthmlMRWa@ep-hidden-bar-a53pg1hu.us-east-2.aws.neon.tech/admin-crud?sslmode=require
