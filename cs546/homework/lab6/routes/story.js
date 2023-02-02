data = {
    "storyTitle": "A Story about a Story",
    "story": "This is a shortened story about a silly mistake I made in high school. In my senior year of high school, I went to a tech center. Here, I learned a lot about computers. However, I also had to take a few other classes to round our the curriculum. One of those classes was English. However, this English class was so overly simple, I was surprised they were teaching it to college students. It was too damned easy, it should have been an 8th grade class. Anyone, one of the assignments was a personal essay. Already disillusioned with the class, and not wanting to participate in the farce of a class, I didn't want to write about my feelings. \n So, I hatched a plan. I would make up a story. So, I made up a story about robbing an ice cream stand. It was relatively poorly written, I didn't put much effort in to the thing. However, that's not how the teacher saw it. When I was called down to the main office, I was greeted by a police officer. They had already called my parents, of course, as well as the ice cream stand in question, to verify it wasn't robbed. After a good yelling at by the head of the school, I was warned I was very close to expulsion, and I was forced to rewrite my paper. I wish they could have just given me a grade though, seeing was written well enough to convince them it was real"
      }


module.exports = function(req, res) {
    res.send(data);
};
