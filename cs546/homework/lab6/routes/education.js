data = [
    { 
        "schoolName": "University of Vermont",
        "degree": "BS EE",
        "favoriteClass": "Digital Signal Processing",
        "favoriteMemory": "Building a 4ft wide quadrotor, that thing was dangerous"
    },
    {
        "schoolName": "University of Vermont",
        "degree": "MS EE",
        "favoriteClass": "Control Systems",
        "favoriteMemory": "building a lego mindstorm cocktail mixer"
    },
    {
      "schoolName": "Stevens Institute of Technology",
      "degree": "(None yet)",
      "favoriteClass": "CS-546",
      "favoriteMemory": "It hasn't happened yet, but I'll know it when I see it"
    }
]


module.exports = function(req, res) {
    res.send(data);
};
