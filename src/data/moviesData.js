const moviesData = {
  "Spider-Man: Across the Spider-Verse": {
    category: "NOW_SHOWING",
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Spider-Man__Cruzando_el_Multiverso.avif?alt=media&token=f4fa147a-a1cf-4b53-9e28-13226c5fe929",
    synopsis: "Miles Morales teams up with Gwen Stacy and a group of Spider-People to battle a powerful new villain known as The Spot, who threatens the multiverse. As they clash over how to handle the situation, Miles finds himself on the run from Miguel O'Hara and other Spider-People.",
    duration: 140,
    releaseDate: "2023-06-02",
    genre: "Animation, Action, Adventure",
    directors: ["Joaquim Dos Santos", "Kemp Powers", "Justin K. Thompson"],
    writers: ["Phil Lord", "Christopher Miller", "David Callaham"],
    rating: "Rated G (General audiences)",
    showtimes: [
      { time: "10:00 AM", room: "12" },
      { time: "2:00 PM", room: "2" },
      { time: "6:00 PM", room: "5" }
    ]
  },
  "Insidious: The Red Door": {
    category: "NOW_SHOWING",
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Insidious__La_Puerta_Roja.avif?alt=media&token=ba158c51-7e50-4f5e-8557-c2165dec3c73",
    synopsis: "Josh and Dalton Lambert must delve deeper into The Further than ever before, confronting their family's dark past and facing a host of new and more horrifying terrors.",
    duration: 107,
    releaseDate: "2023-07-07",
    genre: "Horror, Mystery, Thriller",
    directors: ["Patrick Wilson"],
    writers: ["Leigh Whannell", "Scott Teems"],
    rating: "Rated R (Restricted)",
    showtimes: [
      { time: "10:00 AM", room: "7" },
      { time: "2:00 PM", room: "2" }
    ]
  },
  "Oppenheimer": {
    category: "NOW_SHOWING",
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Oppenheimer.avif?alt=media&token=6562e420-10d0-4611-a948-86455c366c4f",
    synopsis: "A dramatization of the life story of J. Robert Oppenheimer, the physicist who played a key role in the development of the atomic bomb during World War II.",
    duration: 180,
    releaseDate: "2023-07-21",
    genre: "Drama, History, Biography",
    directors: ["Christopher Nolan"],
    writers: ["Christopher Nolan", "Kai Bird", "Martin J. Sherwin"],
    rating: "Rated R (Restricted)",
    showtimes: [
      { time: "10:00 AM", room: "1" },
      { time: "2:00 PM", room: "2" },
      { time: "6:00 PM", room: "3" }
    ]
  },
  "Barbie": {
    category: "NOW_SHOWING",
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Barbie.avif?alt=media&token=ae8474ce-d473-4d8d-bea9-4ade11565265",
    synopsis: "Barbie lives in Barbieland, a perfect world, until she starts questioning her existence and embarks on a journey of self-discovery in the real world.",
    duration: 114,
    releaseDate: "2023-07-21",
    genre: "Comedy, Adventure, Fantasy",
    directors: ["Greta Gerwig"],
    writers: ["Greta Gerwig", "Noah Baumbach"],
    rating: "Rated G (General audiences)",
    showtimes: [
      { time: "10:00 AM", room: "1" },
      { time: "2:00 PM", room: "2" },
      { time: "6:00 PM", room: "3" }
    ]
  },
  "The Super Mario Bros. Movie": {
    category: "NOW_SHOWING",
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Super_Mario_Bros._La_Pel%C3%ADcula.avif?alt=media&token=bf162e79-7a0e-4e53-b658-4f5e50972a14",
    synopsis: "Mario and Luigi, two plumber brothers from Brooklyn, are transported to another world where they become entangled in a battle between the Mushroom Kingdom and the Koopas.",
    duration: 92,
    releaseDate: "2023-04-05",
    genre: "Animation, Adventure, Comedy",
    directors: ["Aaron Horvath", "Michael Jelenic"],
    writers: ["Matthew Fogel"],
    rating: "Rated G (General audiences)",
    showtimes: [
      { time: "10:00 AM", room: "1" },
      { time: "2:00 PM", room: "2" },
      { time: "6:00 PM", room: "13" }
    ]
  },
  "Transformers: Rise of the Beasts": {
    category: "NOW_SHOWING",
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Transformers__El_Despertar_de_las_Bestias.avif?alt=media&token=e27ce527-04b4-463d-8eff-75f856c7e16f",
    synopsis: "The Autobots and their new allies, the Maximals, face an ancient threat from Unicron, a planet-eating Transformer, as they battle to protect Earth from destruction.",
    duration: 127,
    releaseDate: "2023-06-09",
    genre: "Action, Science Fiction, Adventure",
    directors: ["Steven Caple Jr."],
    writers: ["Joby Harold", "Darnell Metayer", "Josh Peters"],
    rating: "Rated R (Restricted)",
    showtimes: [
      { time: "10:00 AM", room: "7" },
      { time: "2:00 PM", room: "2" }
    ]
  },
  "Gran Turismo": {
    category: "NOW_SHOWING",
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Gran_Turismo.avif?alt=media&token=c4da5eb9-8362-4d2a-8154-992a4c3acedf",
    synopsis: "Based on a true story, a young gamer skilled in Gran Turismo racing games gets the chance to become a real-life professional race car driver.",
    duration: 135,
    releaseDate: "2023-08-25",
    genre: "Action, Drama, Sport",
    directors: ["Neill Blomkamp"],
    writers: ["Jason Hall", "Zach Baylin"],
    rating: "Rated R (Restricted)",
    showtimes: [
      { time: "10:00 AM", room: "1" },
      { time: "2:00 PM", room: "2" },
      { time: "6:00 PM", room: "3" }
    ]
  },
  "Fast & Furious X": {
    category: "NOW_SHOWING",
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Fast_%26_Furious_X.avif?alt=media&token=4ab6659d-6c97-4491-8983-370c19360a83",
    synopsis: "Dom Toretto faces his most personal challenge yet as a new threat emerges, targeting his family and everything he holds dear.",
    duration: 141,
    releaseDate: "2023-05-19",
    genre: "Action, Crime, Thriller",
    directors: ["Louis Leterrier"],
    writers: ["Dan Mazeau", "Justin Lin"],
    rating: "Rated R (Restricted)",
    showtimes: [
      { time: "10:00 AM", room: "1" },
      { time: "2:00 PM", room: "25" },
      { time: "6:00 PM", room: "6" }
    ]
  },
  "F1: The Movie": {
    category: "COMING_SOON",
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/F1_La_Pelicula.avif?alt=media&token=362184fd-f282-45d6-ad78-f47c46ebb587",
    synopsis: "A story set in the world of Formula 1, following a veteran driver who returns to train a young talent while facing his own past demons. Speed, drama, and passion combine in this thrilling production.",
    duration: 130,
    releaseDate: "2025-06-13",
    genre: "Action, Drama, Sport",
    directors: ["Joseph Kosinski"],
    writers: ["Ehren Kruger"],
    rating: "Unrated",
    showtimes: [] // Coming soon → no showtimes yet
  },

  "Sé lo que hicistéis el último verano (2025)": {
    category: "COMING_SOON",
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Se_Lo_Que_Hicisteis_El_Ultimo_Verano.avif?alt=media&token=27f63d21-3018-4168-816e-675c91d477d5",
    synopsis: "Años después de los horribles eventos que traumatizaron a un grupo de amigos, una nueva amenaza emerge con sed de venganza. Esta nueva entrega reinventa el clásico del terror con giros inesperados y una tensión constante.",
    duration: 105,
    releaseDate: "2025-08-01",
    genre: "Horror, Mystery, Thriller",
    directors: ["Jennifer Kaytin Robinson"],
    writers: ["Leigh Whannell", "Neal H. Moritz"],
    rating: "Unrated",
    showtimes: []
  },

  "28 Años Después": {
    category: "COMING_SOON",
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/28_A%C3%B1os_Despues.avif?alt=media&token=46e85d65-a393-4633-a907-ef431222bd72",
    synopsis: "Secuela directa de '28 Días Después' y '28 Semanas Después'. El virus Rage regresa más letal que nunca, poniendo a prueba la humanidad de los pocos supervivientes que quedan en un mundo devastado y sin esperanza.",
    duration: 115,
    releaseDate: "2025-06-20",
    genre: "Horror, Sci-Fi, Drama",
    directors: ["Danny Boyle"],
    writers: ["Alex Garland"],
    rating: "Unrated",
    showtimes: []
  }

};

export default moviesData;
