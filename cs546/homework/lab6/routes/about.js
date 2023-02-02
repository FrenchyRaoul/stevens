const express = require("express");
const router = express.Router();

data = {
      "name": "Nicholai L'Esperance",
      "cwid": "10443833",
      "biography": "Nicholai is a 28 year old engineer, working at IBM in Essex Vermont. One of his favorite things to do growing up was playing video games. He grew up watching his older brothers play classic DOS games on their 300MHz computers. When we broke those, we had to fix them. In high school Nicholai purchased his first computer from his neighbor. He learned a lot about how Windows worked, as he fought to remove viruses. Eventually, when Oblivion came out, he realized his computer could not run it, so he learned how to build one that could. \n Nicholai went to the Center for Technology, Essex to further build his computer skills. He became an A+ certified computer technician, and then went on to the University of Vermont, getting his bachelors and masters degrees in electrical engineering. And from there, got a job at IBM. These days, Nicholai lives in a tiny house (that he is putting an expansion on) with his girlfriend on 55 acres, in the middle of the woods. He cooks almost every night, having tacos on Tuesdays. He brew beer and wine, renovates, writes code, rides around on his ATV, plays the drums, and video games when he can find the time.",
      "favoriteShows": ["breaking bad", "better call saul", "stranger things", "its always sunny in philidelphia", "game of thrones", "house of cards", "star trek: TNG", "the office", "firefly", "westworld"],
      "hobbies": ["drums", "video games", "renovation", "atvs", "starting fires", "python", "cooking", "brewing and drinking beer"]
}


module.exports = function(req, res) {
    res.send(data);
};
