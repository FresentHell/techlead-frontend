import '../styles/global.css';

export const metadata = {
  title: 'Gestión de Usuarios y Tareas',
  description: 'Aplicación para la gestión de usuarios y tareas asignadas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
