# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Robles de la Laguna – Gestión de Clientes, Citas y Pagos, Reportes

Esta aplicación permite registrar clientes, agendar citas con fecha y hora, registrar pagos, y generar reportes visuales por cliente. Está diseñada para gestiones de venta de propiedades o administrativos que necesitan control profesional de atención y cobros.

## Requisitos
Node.js v22

Visual Studio Code

GitHub Desktop

Navegador moderno (Chrome, Edge, Firefox)

## Instrucciones
Crear el repositorio en GitHub.

Clonar el proyecto con GitHub Desktop.

Abrir en Visual Studio Code.

Instalar dependencias:
```
 npm init
 ```
  ```
npm install express sweetalert2 bootstrap
 ```

 Ejecutar Frontend:
 npm start


 Se han incluido ejemplos de añadir 
 una cita, pago
 **Appointments.tsx**

 ```json 
 [{
  id: 1,
  nombre: "Daniela Flores",
  fecha: "2025-09-26",
  hora: "07:54",
  notas: "Consulta general"
}] 

 ```
```json
[ {
  id: 1,
  nombre: "Daniela Flores",
  monto: 2500,
  fecha: "2025-09-26"
}]
```
## Herramientas utilizadas

React + TypeScript – Frontend 

Node.js + Express – Backend con rutas y controladores

SweetAlert2 – Alertas interactivas

Bootstrap Icons – Íconos visuales

fs/promises – Lectura y escritura de archivos .json

GitHub Desktop 

[Referencia GitTub Desktop](https://github.com/desktop)

![Logo GitTub Desktop](https://avatars.githubusercontent.com/u/13171334?s=200&v=4)




