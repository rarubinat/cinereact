const moviesData = { 
  "Spider-Man: Across the Spider-Verse": {
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Spider-Man__Cruzando_el_Multiverso.avif?alt=media&token=f4fa147a-a1cf-4b53-9e28-13226c5fe929",
    synopsis: "Miles Morales teams up with Gwen Stacy and a group of Spider-People to face a threat that could destroy all universes. As he fights to save his loved ones, Miles faces a dilemma that forces him to redefine what it means to be a hero.",
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
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Insidious__La_Puerta_Roja.avif?alt=media&token=ba158c51-7e50-4f5e-8557-c2165dec3c73",
    synopsis: "Josh and Dalton return to the spiritual realm to confront the dark secrets that have haunted their family for years. In their final journey into 'The Further,' they must close the red door and end the curse that threatens to destroy them forever.",
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
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Oppenheimer.avif?alt=media&token=6562e420-10d0-4611-a948-86455c366c4f",
    synopsis: "Biography of J. Robert Oppenheimer, the physicist behind the development of the atomic bomb. The film explores his role in the Manhattan Project and the moral dilemma he faced after unleashing a weapon capable of changing the course of human history.",
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
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Barbie.avif?alt=media&token=ae8474ce-d473-4d8d-bea9-4ade11565265",
    synopsis: "Barbie lives in Barbieland, a perfect world... until she starts questioning her reality. Determined to discover the truth about the world and herself, she ventures into the real world on a fun and reflective journey about identity and self-acceptance.",
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
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Super_Mario_Bros._La_Pel%C3%ADcula.avif?alt=media&token=bf162e79-7a0e-4e53-b658-4f5e50972a14",
    synopsis: "Mario and Luigi, two plumber brothers from Brooklyn, are transported to the Mushroom Kingdom. There, they team up with Princess Peach and Toad to face the evil Bowser and save the kingdom from his rule. An epic adventure filled with action and nostalgia.",
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
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Transformers__El_Despertar_de_las_Bestias.avif?alt=media&token=e27ce527-04b4-463d-8eff-75f856c7e16f",
    synopsis: "The Autobots and their new allies, the Maximals, face an ancient threat that could destroy Earth. In this new installment, humans and robots must join forces to save the planet from an imminent intergalactic war.",
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
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Gran_Turismo.avif?alt=media&token=c4da5eb9-8362-4d2a-8154-992a4c3acedf",
    synopsis: "Based on a true story, a young gamer skilled in Gran Turismo is recruited to compete as a professional driver. His talent, passion, and perseverance take him from the screen to the track, facing great challenges and real dangers.",
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
    price: 7.50,
    image: "https://firebasestorage.googleapis.com/v0/b/cinereact-380f3.appspot.com/o/Fast_%26_Furious_X.avif?alt=media&token=4ab6659d-6c97-4491-8983-370c19360a83",
    synopsis: "Dom Toretto faces his most personal challenge yet when an enemy from the past returns seeking revenge. With his family in the crosshairs, Dom must use all his skills and loyalties to protect them in a race against time filled with action, speed, and betrayal.",
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
  }
};

export default moviesData;
