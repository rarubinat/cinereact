const moviesData = { 
  "Spider-Man: Cruzando el Multiverso": {
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Spider-Man__Cruzando_el_Multiverso.avif?alt=media&token=f4fa147a-a1cf-4b53-9e28-13226c5fe929",
    sinopsis: "Miles Morales se une a Gwen Stacy y a un equipo de Spider-Personas para enfrentar una amenaza que podría destruir todos los universos. Mientras lucha por salvar a quienes ama, Miles se enfrenta a un dilema que lo obliga a redefinir lo que significa ser un héroe.",
    duration: 140,
    releaseDate: "2023-06-02",
    genre: "Animación, Acción, Aventura",
    directors: ["Joaquim Dos Santos", "Kemp Powers", "Justin K. Thompson"],
    writers: ["Phil Lord", "Christopher Miller", "David Callaham"],
    rating: "Apta para todos los públicos",
    showtimes: [
      { time: "10:00 AM", room: "12" },
      { time: "2:00 PM", room: "2" },
      { time: "6:00 PM", room: "5" }
    ]
  },
  "Insidious: La puerta roja": {
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Insidious__La_Puerta_Roja.avif?alt=media&token=ba158c51-7e50-4f5e-8557-c2165dec3c73",
    sinopsis: "Josh y Dalton regresan al mundo espiritual para enfrentar los oscuros secretos que han perseguido a su familia durante años. En su viaje final hacia 'El Más Allá', deben cerrar la puerta roja y acabar con la maldición que amenaza con destruirlos para siempre.",
    duration: 107,
    releaseDate: "2023-07-07",
    genre: "Terror, Misterio, Thriller",
    directors: ["Patrick Wilson"],
    writers: ["Leigh Whannell", "Scott Teems"],
    rating: "No apta para todos los públicos",
    showtimes: [
      { time: "10:00 AM", room: "7" },
      { time: "2:00 PM", room: "2" }
    ]
  },
  "Oppenheimer": {
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Oppenheimer.avif?alt=media&token=6562e420-10d0-4611-a948-86455c366c4f",
    sinopsis: "Biografía de J. Robert Oppenheimer, el físico detrás del desarrollo de la bomba atómica. La película explora su papel en el Proyecto Manhattan y el dilema moral que enfrentó tras desatar un arma capaz de cambiar la historia de la humanidad.",
    duration: 180,
    releaseDate: "2023-07-21",
    genre: "Drama, Historia, Biografía",
    directors: ["Christopher Nolan"],
    writers: ["Christopher Nolan", "Kai Bird", "Martin J. Sherwin"],
    rating: "No apta para todos los públicos",
    showtimes: [
      { time: "10:00 AM", room: "1" },
      { time: "2:00 PM", room: "2" },
      { time: "6:00 PM", room: "3" }
    ]
  },
  "Barbie": {
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Barbie.avif?alt=media&token=ae8474ce-d473-4d8d-bea9-4ade11565265",
    sinopsis: "Barbie vive en Barbieland, un mundo perfecto... hasta que empieza a cuestionarse su realidad. Decidida a descubrir la verdad sobre el mundo y sobre sí misma, se aventura al mundo real en una divertida y reflexiva odisea sobre la identidad y la autoaceptación.",
    duration: 114,
    releaseDate: "2023-07-21",
    genre: "Comedia, Aventura, Fantasía",
    directors: ["Greta Gerwig"],
    writers: ["Greta Gerwig", "Noah Baumbach"],
    rating: "Apta para todos los públicos",
    showtimes: [
      { time: "10:00 AM", room: "Sala 1" },
      { time: "2:00 PM", room: "2" },
      { time: "6:00 PM", room: "3" }
    ]
  },
  "Super Mario Bross: La película": {
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Super_Mario_Bros._La_Pel%C3%ADcula.avif?alt=media&token=bf162e79-7a0e-4e53-b658-4f5e50972a14",
    sinopsis: "Mario y Luigi, dos hermanos fontaneros de Brooklyn, son transportados al Reino Champiñón. Allí, unen fuerzas con la Princesa Peach y Toad para enfrentar al malvado Bowser y rescatar al reino de su dominio. Una aventura épica con acción y nostalgia.",
    duration: 92,
    releaseDate: "2023-04-05",
    genre: "Animación, Aventura, Comedia",
    directors: ["Aaron Horvath", "Michael Jelenic"],
    writers: ["Matthew Fogel"],
    rating: "Apta para todos los públicos",
    showtimes: [
      { time: "10:00 AM", room: "1" },
      { time: "2:00 PM", room: "2" },
      { time: "6:00 PM", room: "13" }
    ]
  },
  "Transformers: El despertar de las bestias": {
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Transformers__El_Despertar_de_las_Bestias.avif?alt=media&token=e27ce527-04b4-463d-8eff-75f856c7e16f",
    sinopsis: "Los Autobots y los nuevos aliados Maximals se enfrentan a una amenaza ancestral que podría destruir la Tierra. En esta nueva entrega, humanos y robots deben unir fuerzas para salvar el planeta de una guerra intergaláctica inminente.",
    duration: 127,
    releaseDate: "2023-06-09",
    genre: "Acción, Ciencia ficción, Aventura",
    directors: ["Steven Caple Jr."],
    writers: ["Joby Harold", "Darnell Metayer", "Josh Peters"],
    rating: "No apta para todos los públicos",
    showtimes: [
      { time: "10:00 AM", room: "7" },
      { time: "2:00 PM", room: "2" }
    ]
  },
  "Gran Turismo": {
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Gran_Turismo.avif?alt=media&token=c4da5eb9-8362-4d2a-8154-992a4c3acedf",
    sinopsis: "Basada en una historia real, un joven jugador experto en el videojuego Gran Turismo es reclutado para competir como piloto profesional. Su talento, pasión y perseverancia lo llevarán de la pantalla a las pistas, enfrentando grandes desafíos y riesgos reales.",
    duration: 135,
    releaseDate: "2023-08-25",
    genre: "Acción, Drama, Deporte",
    directors: ["Neill Blomkamp"],
    writers: ["Jason Hall", "Zach Baylin"],
    rating: "No apta para todos los públicos",
    showtimes: [
      { time: "10:00 AM", room: "1" },
      { time: "2:00 PM", room: "2" },
      { time: "6:00 PM", room: "3" }
    ]
  },
  "Fast & Furious X": {
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Fast_%26_Furious_X.avif?alt=media&token=4ab6659d-6c97-4491-8983-370c19360a83",
    sinopsis: "Dom Toretto enfrenta su desafío más personal cuando un enemigo del pasado regresa buscando venganza. Con su familia en la mira, Dom deberá usar todas sus habilidades y lealtades para protegerlos en una carrera contrarreloj llena de acción, velocidad y traición.",
    duration: 141,
    releaseDate: "2023-05-19",
    genre: "Acción, Crimen, Thriller",
    directors: ["Louis Leterrier"],
    writers: ["Dan Mazeau", "Justin Lin"],
    rating: "No apta para todos los públicos",
    showtimes: [
      { time: "10:00 AM", room: "1" },
      { time: "2:00 PM", room: "25" },
      { time: "6:00 PM", room: "6" }
    ]
  }
};

export default moviesData;