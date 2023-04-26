doSomethingFirst = (name, location) => ({
  type: "FIRST_TYPE",
  name: name,
  location: location
})

changeLocation = (location) =>({
    type: "SECOND_TYPE",
    location
})

module.exports = {
    doSomethingFirst,
    changeLocation,
}