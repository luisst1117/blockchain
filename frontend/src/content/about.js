export const APP_NAME = "InmoLedger";

export const DEVELOPER = {
  name: "Luis Stiven Ramirez Lopez",
  place: "Popayán, Cauca, Colombia",
};

export const intro = {
  kicker: "Prototipo académico · Popayán",
  title: APP_NAME,
  what: "Esta aplicación sirve para registrar un inmueble, dejar constancia de quién es el dueño y guardar la escritura junto con los datos del predio. Cada movimiento queda registrado y no se puede borrar a escondidas.",
  why: "Está pensada para que un propietario inscriba su predio, un validador revise la escritura y, si hay compraventa, el título pase a otra persona. No reemplaza al registro oficial de Popayán: es un prototipo para entender ese proceso.",
};

export const about = {
  title: "Acerca de",
  purposeTitle: "¿Para qué se desarrolló?",
  purpose: [
    "Esta aplicación es un prototipo académico desarrollado como parte de un proyecto de grado, cuyo propósito es demostrar cómo la tecnología Blockchain puede contribuir a mejorar la seguridad, transparencia y trazabilidad en el registro y la gestión de la información inmobiliaria.",
    "La plataforma permite registrar, consultar, validar y transferir inmuebles mediante contratos inteligentes, sin depender de una base de datos centralizada que permita modificar unilateralmente los registros. La información del inmueble y los documentos asociados, como las escrituras, se almacenan de forma descentralizada, mientras que Blockchain conserva el registro de propiedad, su estado y las referencias a dichos documentos.",
  ],
  rolesLead:
    "El sistema cuenta con tres roles que permiten gestionar las operaciones de acuerdo con sus responsabilidades:",
  roles: [
    {
      name: "Propietario",
      text: "registra sus inmuebles, consulta su información y realiza transferencias de propiedad.",
    },
    {
      name: "Validador",
      text: "revisa la documentación asociada a los inmuebles y realiza su validación.",
    },
    {
      name: "Administrador",
      text: "gestiona los permisos de los usuarios autorizados para desempeñar el rol de validador.",
    },
  ],
  closing:
    "De esta manera, el prototipo busca evidenciar cómo el uso de Blockchain y los contratos inteligentes puede fortalecer la integridad de los registros inmobiliarios y facilitar la verificación de la información.",
  authorTitle: "¿Quién desarrolló el proyecto?",
  authorName: DEVELOPER.name,
  authorPhoto: "/autor.jpg",
  author:
    "Prototipo académico desarrollado en Popayán, Cauca, Colombia, como parte de un proyecto de grado orientado a la aplicación de tecnología Blockchain en la gestión y registro de información inmobiliaria.",
};
