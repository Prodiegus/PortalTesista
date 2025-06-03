export const CONST = {
  temas: [
    {
      id: 1,
      tema: 'Portal Tesista',
      ProfesorGuia: 'Rodrigo Pavez',
      ProfesorCoGuia: '-',
      Estado: 'En trabajo',
      Escuela: 'Ingeniería Civil en Computación',
      creación: '16/08/2024',
      resumen: 'Este proyecto consiste en desarrollar un portal de tesis que pueda ser integrado dentro de los sistemas de la Universidad de Talca en la escuela de ingeniería civil en computación, permitiendo gestionar de manera eficiente los proyectos de titulación y así facilitar este proceso tanto para docentes como para estudiantes. El sistema incluirá funciones para registrar y hacer seguimiento del avance de los proyectos, evaluar su progreso, administrar usuarios, la propiedad intelectual (según los privilegios), y coordinar reuniones. Además los docentes podrán ser gestionados desde un portal administrativo El sistema manejará diferentes estados de los proyectos (pendientes, en trabajo, disponibles, terminados), definidos por cada docente a cargo de un tema de tesis. Esto ayudará a realizar un seguimiento más efectivo de los temas trabajados y ofrecerá herramientas para invitar a otros docentes o personas (Estudiantes) a colaborar, y visualizar estadásticas y el historial de los proyectos. Asimismo, permitirá organizar reuniones, aplicar criterios de avance, y manejar versiones de los proyectos. Cada proyecto contará con un apartado para su estado del arte y una visualización de los estudiantes responsables.'
    },
    {
      id: 2,
      tema: 'Ipplanner v2',
      ProfesorGuia: 'Ruth Garrido',
      ProfesorCoGuia: '-',
      Estado: 'Pendiente',
      Escuela: 'Ingeniería Civil en Computación',
      creación: '20/03/2018',
      resumen: 'La inscripción de asignaturas, denominadas módulos en la Universidad de Talca, es un proceso que se lleva a cabo en cada nuevo período académico en las universidades. Esta instancia es de gran relevancia, ya que los estudiantes deciden el futuro sobre sus estudios, guiando el camino que los llevaría a obtener su título universitario. Al momento de inscribir módulos, los estudiantes deben reconocer y evaluar muchos factores, donde se destacan las líneas críticas. Es un proceso complejo e impacta en el tiempo de permanencia de los estudiantes en la Universidad. Una mala inscripción puede tener como consecuencia un retraso en el egreso del estudiante, enfatizando la relevancia de tomar buenas decisiones a la hora de inscribir. Entonces, teniendo tanta importancia >cómo pueden los estudiantes estar seguros de que las decisiones tomadas son correctas? Son necesarias las herramientas adecuadas y actualmente los estudiantes no disponen de ellas. Esta memoria busca ayudar en esta problemática, realizando el diseño y desarrollo de una herramienta que brinda apoyo a los estudiantes en la toma de decisiones durante el proceso de inscripción de módulos. Como parte de la metodología, se detallan los pasos para el diseño e implementación de un algoritmo capaz de sugerir planes de inscripción a los estudiantes. A su vez, teniendo Scrum como base de la metodología de desarrollo de software, se implementa una aplicación web para la interacción de los usuarios con dicho algoritmo. La herramienta desarrollada trabaja con carreras de régimen semestral y fue probada en la carrera de Ingeniería Civil en Computación. Su finalidad es disminuir la carga que involucra decidir correctamente los módulos a inscribir y realizar ese proceso con suficiente información de respaldo. Los resultados obtenidos en una encuesta aplicada a los potenciales usuarios indican que más del 90% de los encuestados manifiestan que la herramienta creada es de gran utilidad y se apoyarían en ella durante la inscripción. Se destaca también la aprobación de la herramienta por parte de la profesora Ruth Garrido, Directora de Escuela de la carrera mencionada con anterioridad.'
    },
    {
      id: 3,
      tema: 'Generación de grafos inducidos por la ley de potencia',
      ProfesorGuia: 'Rodrigo Paredes',
      ProfesorCoGuia: 'Renzo Angles',
      Alumno: 'Diego Alejandro Iturriaga Peña',
      Escuela: 'Ingeniería Civil en Computación',
      Estado: 'Finalizado',
      creación: '20/03/2020',
      resumen: 'Los grafos y la ley de potencia están estrechamente relacionados en el mundo real. Por ejemplo en una red social, la relación de amigos o seguidores globales de un individuo obedecen la distribución de ley de potencia. Este tipo de redes son muy estudiadas en la actualidad, pero no se proporciona acceso a estas, porque los datos son un recurso crítico y sensible. Esto ha llevado a la creación de métodos que generan grafos sintéticos que reproducen las características de grafos reales. Entre dichos métodos se encuentran R-MAT y R3MAT, donde el primero tiene problemas del uso de memoria y al segundo le toma mucho tiempo generar la distribución de aristas por su funcionamiento recursivo. Por esto, el problema que se enfrenta en esta memoria es mejorar el tiempo de producción de un grafo sintético manteniendo las propiedades de la ley de potencia. Para esto, se usa una metodología de investigación cuantitativa de cuatro fases. Es muy relevante en esta memoria la función de probabilidad de la ley de potencia, P(x = k) = C x k-t que en el contexto de grafos indica la fracción de nodos que deben tener k vecinos para que esta estructura mantenga la distribución de la ley de potencia. Para la generación de grafos sintéticos, en los métodos de esta memoria se utiliza directamente la función de probabilidad de la ley de potencia para aproximar la cantidad de nodos que deben existir por el número de vecinos, con el fin de mantener dicha propiedad en las estructuras generadas. Como resultado, se han obtenido tres métodos que generan grafos con distribución de la ley de potencia con los cuales se han generado grafos de hasta 250 millones de nodos llegando a generar m as de tres mil millones de aristas en algunos casos. Mediante las evaluaciones experimentales que se realizan para comparar uno de los métodos propuestos con otros algoritmos existentes, se comprobó una reducción del tiempo de generación con respecto a estos métodos alternativos. También se probó que efectivamente los grafos generados mantienen la propiedad de la ley de potencia por medio de la visualización de la distribución del número de nodos que se genera para los valores de k vecinos posibles. Finalmente, se logró obtener un método que reduce el tiempo de generación y que produce un grafo que mantiene la propiedad de distribución de la ley de potencia.'
    },
    {
      id: 1,
      tema: 'Portal Tesista',
      ProfesorGuia: 'Rodrigo Pavez',
      ProfesorCoGuia: '-',
      Estado: 'En trabajo',
      Escuela: 'Ingeniería Civil en Computación',
      creación: '16/08/2024',
      resumen: 'Este proyecto consiste en desarrollar un portal de tesis que pueda ser integrado dentro de los sistemas de la Universidad de Talca en la escuela de ingeniería civil en computación, permitiendo gestionar de manera eficiente los proyectos de titulación y así facilitar este proceso tanto para docentes como para estudiantes. El sistema incluirá funciones para registrar y hacer seguimiento del avance de los proyectos, evaluar su progreso, administrar usuarios, la propiedad intelectual (según los privilegios), y coordinar reuniones. Además los docentes podrán ser gestionados desde un portal administrativo El sistema manejará diferentes estados de los proyectos (pendientes, en trabajo, disponibles, terminados), definidos por cada docente a cargo de un tema de tesis. Esto ayudará a realizar un seguimiento más efectivo de los temas trabajados y ofrecerá herramientas para invitar a otros docentes o personas (Estudiantes) a colaborar, y visualizar estadásticas y el historial de los proyectos. Asimismo, permitirá organizar reuniones, aplicar criterios de avance, y manejar versiones de los proyectos. Cada proyecto contará con un apartado para su estado del arte y una visualización de los estudiantes responsables.'
    },
    {
      id: 2,
      tema: 'Ipplanner v2',
      ProfesorGuia: 'Ruth Garrido',
      ProfesorCoGuia: '-',
      Estado: 'Pendiente',
      Escuela: 'Ingeniería Civil en Computación',
      creación: '20/03/2018',
      resumen: 'La inscripción de asignaturas, denominadas módulos en la Universidad de Talca, es un proceso que se lleva a cabo en cada nuevo período académico en las universidades. Esta instancia es de gran relevancia, ya que los estudiantes deciden el futuro sobre sus estudios, guiando el camino que los llevaría a obtener su título universitario. Al momento de inscribir módulos, los estudiantes deben reconocer y evaluar muchos factores, donde se destacan las líneas críticas. Es un proceso complejo e impacta en el tiempo de permanencia de los estudiantes en la Universidad. Una mala inscripción puede tener como consecuencia un retraso en el egreso del estudiante, enfatizando la relevancia de tomar buenas decisiones a la hora de inscribir. Entonces, teniendo tanta importancia >cómo pueden los estudiantes estar seguros de que las decisiones tomadas son correctas? Son necesarias las herramientas adecuadas y actualmente los estudiantes no disponen de ellas. Esta memoria busca ayudar en esta problemática, realizando el diseño y desarrollo de una herramienta que brinda apoyo a los estudiantes en la toma de decisiones durante el proceso de inscripción de módulos. Como parte de la metodología, se detallan los pasos para el diseño e implementación de un algoritmo capaz de sugerir planes de inscripción a los estudiantes. A su vez, teniendo Scrum como base de la metodología de desarrollo de software, se implementa una aplicación web para la interacción de los usuarios con dicho algoritmo. La herramienta desarrollada trabaja con carreras de régimen semestral y fue probada en la carrera de Ingeniería Civil en Computación. Su finalidad es disminuir la carga que involucra decidir correctamente los módulos a inscribir y realizar ese proceso con suficiente información de respaldo. Los resultados obtenidos en una encuesta aplicada a los potenciales usuarios indican que más del 90% de los encuestados manifiestan que la herramienta creada es de gran utilidad y se apoyarían en ella durante la inscripción. Se destaca también la aprobación de la herramienta por parte de la profesora Ruth Garrido, Directora de Escuela de la carrera mencionada con anterioridad.'
    },
    {
      id: 3,
      tema: 'Generación de grafos inducidos por la ley de potencia',
      ProfesorGuia: 'Rodrigo Paredes',
      ProfesorCoGuia: 'Renzo Angles',
      Alumno: 'Diego Alejandro Iturriaga Peña',
      Escuela: 'Ingeniería Civil en Computación',
      Estado: 'Finalizado',
      creación: '20/03/2020',
      resumen: 'Los grafos y la ley de potencia están estrechamente relacionados en el mundo real. Por ejemplo en una red social, la relación de amigos o seguidores globales de un individuo obedecen la distribución de ley de potencia. Este tipo de redes son muy estudiadas en la actualidad, pero no se proporciona acceso a estas, porque los datos son un recurso crítico y sensible. Esto ha llevado a la creación de métodos que generan grafos sintéticos que reproducen las características de grafos reales. Entre dichos métodos se encuentran R-MAT y R3MAT, donde el primero tiene problemas del uso de memoria y al segundo le toma mucho tiempo generar la distribución de aristas por su funcionamiento recursivo. Por esto, el problema que se enfrenta en esta memoria es mejorar el tiempo de producción de un grafo sintético manteniendo las propiedades de la ley de potencia. Para esto, se usa una metodología de investigación cuantitativa de cuatro fases. Es muy relevante en esta memoria la función de probabilidad de la ley de potencia, P(x = k) = C x k-t que en el contexto de grafos indica la fracción de nodos que deben tener k vecinos para que esta estructura mantenga la distribución de la ley de potencia. Para la generación de grafos sintéticos, en los métodos de esta memoria se utiliza directamente la función de probabilidad de la ley de potencia para aproximar la cantidad de nodos que deben existir por el número de vecinos, con el fin de mantener dicha propiedad en las estructuras generadas. Como resultado, se han obtenido tres métodos que generan grafos con distribución de la ley de potencia con los cuales se han generado grafos de hasta 250 millones de nodos llegando a generar m as de tres mil millones de aristas en algunos casos. Mediante las evaluaciones experimentales que se realizan para comparar uno de los métodos propuestos con otros algoritmos existentes, se comprobó una reducción del tiempo de generación con respecto a estos métodos alternativos. También se probó que efectivamente los grafos generados mantienen la propiedad de la ley de potencia por medio de la visualización de la distribución del número de nodos que se genera para los valores de k vecinos posibles. Finalmente, se logró obtener un método que reduce el tiempo de generación y que produce un grafo que mantiene la propiedad de distribución de la ley de potencia.'
    },
    {
      id: 1,
      tema: 'Portal Tesista',
      ProfesorGuia: 'Rodrigo Pavez',
      ProfesorCoGuia: '-',
      Estado: 'En trabajo',
      Escuela: 'Ingeniería Civil en Computación',
      creación: '16/08/2024',
      resumen: 'Este proyecto consiste en desarrollar un portal de tesis que pueda ser integrado dentro de los sistemas de la Universidad de Talca en la escuela de ingeniería civil en computación, permitiendo gestionar de manera eficiente los proyectos de titulación y así facilitar este proceso tanto para docentes como para estudiantes. El sistema incluirá funciones para registrar y hacer seguimiento del avance de los proyectos, evaluar su progreso, administrar usuarios, la propiedad intelectual (según los privilegios), y coordinar reuniones. Además los docentes podrán ser gestionados desde un portal administrativo El sistema manejará diferentes estados de los proyectos (pendientes, en trabajo, disponibles, terminados), definidos por cada docente a cargo de un tema de tesis. Esto ayudará a realizar un seguimiento más efectivo de los temas trabajados y ofrecerá herramientas para invitar a otros docentes o personas (Estudiantes) a colaborar, y visualizar estadásticas y el historial de los proyectos. Asimismo, permitirá organizar reuniones, aplicar criterios de avance, y manejar versiones de los proyectos. Cada proyecto contará con un apartado para su estado del arte y una visualización de los estudiantes responsables.'
    },
    {
      id: 2,
      tema: 'Ipplanner v2',
      ProfesorGuia: 'Ruth Garrido',
      ProfesorCoGuia: '-',
      Estado: 'Pendiente',
      Escuela: 'Ingeniería Civil en Computación',
      creación: '20/03/2018',
      resumen: 'La inscripción de asignaturas, denominadas módulos en la Universidad de Talca, es un proceso que se lleva a cabo en cada nuevo período académico en las universidades. Esta instancia es de gran relevancia, ya que los estudiantes deciden el futuro sobre sus estudios, guiando el camino que los llevaría a obtener su título universitario. Al momento de inscribir módulos, los estudiantes deben reconocer y evaluar muchos factores, donde se destacan las líneas críticas. Es un proceso complejo e impacta en el tiempo de permanencia de los estudiantes en la Universidad. Una mala inscripción puede tener como consecuencia un retraso en el egreso del estudiante, enfatizando la relevancia de tomar buenas decisiones a la hora de inscribir. Entonces, teniendo tanta importancia >cómo pueden los estudiantes estar seguros de que las decisiones tomadas son correctas? Son necesarias las herramientas adecuadas y actualmente los estudiantes no disponen de ellas. Esta memoria busca ayudar en esta problemática, realizando el diseño y desarrollo de una herramienta que brinda apoyo a los estudiantes en la toma de decisiones durante el proceso de inscripción de módulos. Como parte de la metodología, se detallan los pasos para el diseño e implementación de un algoritmo capaz de sugerir planes de inscripción a los estudiantes. A su vez, teniendo Scrum como base de la metodología de desarrollo de software, se implementa una aplicación web para la interacción de los usuarios con dicho algoritmo. La herramienta desarrollada trabaja con carreras de régimen semestral y fue probada en la carrera de Ingeniería Civil en Computación. Su finalidad es disminuir la carga que involucra decidir correctamente los módulos a inscribir y realizar ese proceso con suficiente información de respaldo. Los resultados obtenidos en una encuesta aplicada a los potenciales usuarios indican que más del 90% de los encuestados manifiestan que la herramienta creada es de gran utilidad y se apoyarían en ella durante la inscripción. Se destaca también la aprobación de la herramienta por parte de la profesora Ruth Garrido, Directora de Escuela de la carrera mencionada con anterioridad.'
    },
    {
      id: 3,
      tema: 'Generación de grafos inducidos por la ley de potencia',
      ProfesorGuia: 'Rodrigo Paredes',
      ProfesorCoGuia: 'Renzo Angles',
      Alumno: 'Diego Alejandro Iturriaga Peña',
      Escuela: 'Ingeniería Civil en Computación',
      Estado: 'Finalizado',
      creación: '20/03/2020',
      resumen: 'Los grafos y la ley de potencia están estrechamente relacionados en el mundo real. Por ejemplo en una red social, la relación de amigos o seguidores globales de un individuo obedecen la distribución de ley de potencia. Este tipo de redes son muy estudiadas en la actualidad, pero no se proporciona acceso a estas, porque los datos son un recurso crítico y sensible. Esto ha llevado a la creación de métodos que generan grafos sintéticos que reproducen las características de grafos reales. Entre dichos métodos se encuentran R-MAT y R3MAT, donde el primero tiene problemas del uso de memoria y al segundo le toma mucho tiempo generar la distribución de aristas por su funcionamiento recursivo. Por esto, el problema que se enfrenta en esta memoria es mejorar el tiempo de producción de un grafo sintético manteniendo las propiedades de la ley de potencia. Para esto, se usa una metodología de investigación cuantitativa de cuatro fases. Es muy relevante en esta memoria la función de probabilidad de la ley de potencia, P(x = k) = C x k-t que en el contexto de grafos indica la fracción de nodos que deben tener k vecinos para que esta estructura mantenga la distribución de la ley de potencia. Para la generación de grafos sintéticos, en los métodos de esta memoria se utiliza directamente la función de probabilidad de la ley de potencia para aproximar la cantidad de nodos que deben existir por el número de vecinos, con el fin de mantener dicha propiedad en las estructuras generadas. Como resultado, se han obtenido tres métodos que generan grafos con distribución de la ley de potencia con los cuales se han generado grafos de hasta 250 millones de nodos llegando a generar m as de tres mil millones de aristas en algunos casos. Mediante las evaluaciones experimentales que se realizan para comparar uno de los métodos propuestos con otros algoritmos existentes, se comprobó una reducción del tiempo de generación con respecto a estos métodos alternativos. También se probó que efectivamente los grafos generados mantienen la propiedad de la ley de potencia por medio de la visualización de la distribución del número de nodos que se genera para los valores de k vecinos posibles. Finalmente, se logró obtener un método que reduce el tiempo de generación y que produce un grafo que mantiene la propiedad de distribución de la ley de potencia.'
    }
  ],
  userRepresentation: {
    id: "69367004-7d33-4d97-a8a8-c7264b25838f",
    nombre: "Diego Fernández",
    rut: "20509736",
    escuela: "Ingeniería Civil en Computación",
    correo: "diego.d.a.f.v.2000@gmail.com",
    tipo: "cargo",
    activo: 1
  },
  escuelas: [
    {
      id: 1,
      nombre: 'Ingeniería Civil en Computación',
      rut_profesor_a_cargo: '20509736',
    },
    {
      id: 2,
      nombre: 'Ingeniería Civil Industrial',
      rut_profesor_a_cargo: '20509736',
    },
    {
      id: 3,
      nombre: 'Ingeniería Civil Electrónica',
      rut_profesor_a_cargo: '20509736',
    },
    {
      id: 4,
      nombre: 'Ingeniería Civil Mecánica',
      rut_profesor_a_cargo: '20509736',
    },
    {
      id: 5,
      nombre: 'Ingeniería Civil Química',
      rut_profesor_a_cargo: '20509736',
    },
    {
      id: 6,
      nombre: 'Ingeniería Comercial',
      rut_profesor_a_cargo: '20509736',
    }
  ],
  avances: [
    {
      aprobado:true,
      archivo:null,
      comentarios:"Buen trabajo - Muy bien",
      fecha:"2025-05-08T19:59:18.000Z",
      feedback:null,
      id:4,
      id_avance:4,
      id_tema:1,
      nombre_archivo:"memoria.pdf",
      nota:7,
      revision_visible:0
    },
    {
      aprobado:true,
      archivo:null,
      comentarios:"Buen trabajo - Muy bien",
      fecha:"2025-05-08T19:59:18.000Z",
      feedback:null,
      id:4,
      id_avance:4,
      id_tema:1,
      nombre_archivo:"memoria.pdf",
      nota:7,
      revision_visible:0
    },
    {
      aprobado:true,
      archivo:null,
      comentarios:"Buen trabajo - Muy bien",
      fecha:"2025-05-08T19:59:18.000Z",
      feedback:null,
      id:4,
      id_avance:4,
      id_tema:1,
      nombre_archivo:"memoria.pdf",
      nota:7,
      revision_visible:0
    }
  ],
  fases: [
    {
      id: 3,
      numero: 1,
      nombre: "Etapa 1",
      descripcion: "Fase auto generada",
      tipo: "guia",
      fecha_inicio: "2024-12-11T21:00:00.000Z",
      fecha_termino: "2025-03-02T21:00:00.000Z",
      rut_creador: "20307526",
      id_flujo: 3,
      id_padre: 1
    },
    {
      id: 4,
      numero: 1,
      nombre: "Etapa 2",
      descripcion: "Fase auto generada",
      tipo: "guia",
      fecha_inicio: "2025-03-17T11:22:00.000Z",
      fecha_termino: "2025-07-22T23:22:00.000Z",
      rut_creador: "20307526",
      id_flujo: 4,
      id_padre: 2
    },
    {
      id: 11,
      numero: 1,
      nombre: "Definición y planificacion del proyecto",
      descripcion: "Informe propuesta",
      tipo: "alumno",
      fecha_inicio: "2024-08-12T05:22:00.000Z",
      fecha_termino: "2024-09-23T18:00:00.000Z",
      rut_creador: "205097368",
      id_flujo: 11,
      id_padre: 3
    },
    {
      id: 25,
      numero: 2,
      nombre: "Análisis de requerimientos y necesidades",
      descripcion: "Docuemnto de requisitos",
      tipo: "alumno",
      fecha_inicio: "2024-09-24T21:14:00.000Z",
      fecha_termino: "2024-10-04T21:15:00.000Z",
      rut_creador: "205097368",
      id_flujo: 11,
      id_padre: 3
    },
    {
      id: 26,
      numero: 3,
      nombre: "Diseño del sistema",
      descripcion: "Documento de diseño ",
      tipo: "alumno",
      fecha_inicio: "2024-10-07T18:16:00.000Z",
      fecha_termino: "2024-10-25T18:16:00.000Z",
      rut_creador: "205097368",
      id_flujo: 11,
      id_padre: 3
    },
    {
      id: 27,
      numero: 4,
      nombre: "Prototipado y validación inicial",
      descripcion: "Prototipo validado",
      tipo: "alumno",
      fecha_inicio: "2024-10-28T21:17:00.000Z",
      fecha_termino: "2024-11-15T21:17:00.000Z",
      rut_creador: "205097368",
      id_flujo: 11,
      id_padre: 3
    },
    {
      id: 28,
      numero: 5,
      nombre: "Desarrollo parte 1",
      descripcion: "Versión lista para pruebas",
      tipo: "alumno",
      fecha_inicio: "2024-11-18T15:18:00.000Z",
      fecha_termino: "2024-12-20T10:18:00.000Z",
      rut_creador: "205097368",
      id_flujo: 11,
      id_padre: 3
    },
    {
      id: 12,
      numero: 1,
      nombre: "Desarrollo parte 2",
      descripcion: "Versión lista para pruebas",
      tipo: "alumno",
      fecha_inicio: "2025-03-10T08:22:00.000Z",
      fecha_termino: "2025-05-16T19:22:00.000Z",
      rut_creador: "205097368",
      id_flujo: 12,
      id_padre: 4
    },
    {
      id: 29,
      numero: 2,
      nombre: "Pruebas y validación ",
      descripcion: "Aplicación ajustada y validada con las pruebas",
      tipo: "alumno",
      fecha_inicio: "2025-05-17T22:22:00.000Z",
      fecha_termino: "2025-06-20T22:22:00.000Z",
      rut_creador: "205097368",
      id_flujo: 12,
      id_padre: 4
    },
    {
      id: 30,
      numero: 3,
      nombre: "Documentación final",
      descripcion: "Informe de memoria",
      tipo: "alumno",
      fecha_inicio: "2025-05-19T22:23:00.000Z",
      fecha_termino: "2025-07-04T22:23:00.000Z",
      rut_creador: "205097368",
      id_flujo: 12,
      id_padre: 4
    }
  ]
}
